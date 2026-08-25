module IntradayQuotes
  class SyncService
    def initialize(fin_mind_fetcher: FinMind::StockKBarFetcher.new, twse_fetcher: Twse::RealtimeQuoteFetcher.new)
      @fin_mind_fetcher = fin_mind_fetcher
      @twse_fetcher = twse_fetcher
    end

    def call(stock_id:, date: Date.current.to_s)
      sync_from_fin_mind(stock_id, date) || sync_from_twse(stock_id, date)
    end

    private

    # FinMind's KBar dataset returns every minute bar for the day in one
    # call, so a single sync catches the DB up in full instead of only
    # accumulating whatever TWSE's poller happened to sample.
    def sync_from_fin_mind(stock_id, date)
      bars = @fin_mind_fetcher.call(stock_id: stock_id, date: date)
      return false if bars.blank?

      rows = bars.filter_map { |bar| kbar_row(stock_id, bar) }
      return false if rows.empty?

      IntradayQuote.upsert_all(rows, unique_by: [ :stock_id, :quoted_at ])
      true
    rescue FinMind::Client::Error => e
      Rails.logger.warn("IntradayQuotes::SyncService: FinMind failed for #{stock_id}: #{e.message}")
      false
    end

    # TWSE only ever returns the current snapshot, and pre-market that's
    # still yesterday's close — only store it when it actually belongs
    # to the date being synced, so a stale snapshot can't masquerade as
    # (and block a later real backfill of) a different day's data.
    def sync_from_twse(stock_id, date)
      quote = @twse_fetcher.call(stock_id: stock_id)
      return false if quote[:price].nil? || quote[:quoted_at].nil?
      return false if quote[:quoted_at].to_date.to_s != date

      IntradayQuote.upsert(
        quote.slice(:stock_id, :quoted_at, :price, :open, :high, :low, :previous_close, :volume),
        unique_by: [ :stock_id, :quoted_at ],
      )
      true
    end

    def kbar_row(stock_id, bar)
      quoted_at = parse_time(bar["date"], bar["minute"])
      return nil if quoted_at.nil?

      {
        stock_id: stock_id,
        quoted_at: quoted_at,
        price: bar["close"],
        open: bar["open"],
        high: bar["high"],
        low: bar["low"],
        volume: bar["volume"]
      }
    end

    def parse_time(date_str, minute_str)
      return nil if date_str.blank? || minute_str.blank?
      Time.zone.parse("#{date_str} #{minute_str}")
    rescue ArgumentError
      nil
    end
  end
end
