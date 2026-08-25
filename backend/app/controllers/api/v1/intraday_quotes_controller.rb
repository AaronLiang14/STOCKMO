module Api
  module V1
    class IntradayQuotesController < BaseController
      rescue_from Twse::Client::Error do |error|
        render json: { error: error.message }, status: :bad_gateway
      end

      # Accumulated quotes for a stock on a given date. Watchlist stocks
      # are kept warm by PollIntradayQuotesJob; any other stock (or an
      # older date) is synced on first request and cached from then on.
      def index
        stock_id = params.require(:data_id)
        date = params[:date].present? ? Date.parse(params[:date]) : Date.current
        scope = intraday_scope(stock_id, date)

        if scope.empty?
          IntradayQuotes::SyncService.new.call(stock_id: stock_id, date: date.to_s)
          scope = intraday_scope(stock_id, date)
        end

        render json: { data: scope.map(&:as_kbar_json) }
      end

      # Live snapshot (not the DB) — powers the stock header's current
      # price, high/low, volume, and change. Tries FinMind's paid tick
      # snapshot first, falling back to TWSE's free endpoint if FinMind
      # errors or has no data (e.g. off-hours).
      def latest
        stock_id = params.require(:data_id)
        quote = fetch_latest_quote(stock_id)

        change_price = nil
        change_rate = nil
        if quote[:price] && quote[:previous_close]&.nonzero?
          change_price = (quote[:price] - quote[:previous_close]).round(2)
          change_rate = (change_price / quote[:previous_close] * 100).round(2)
        end

        render json: {
          data: [
            {
              close: quote[:price]&.to_f,
              change_price: change_price&.to_f,
              change_rate: change_rate&.to_f,
              high: quote[:high]&.to_f,
              low: quote[:low]&.to_f,
              total_volume: quote[:volume]
            }
          ]
        }
      end

      private

      def intraday_scope(stock_id, date)
        IntradayQuote
          .where(stock_id: stock_id)
          .where(quoted_at: date.beginning_of_day..date.end_of_day)
          .order(:quoted_at)
      end

      def fetch_latest_quote(stock_id)
        quote = FinMind::RealtimeQuoteFetcher.new.call(stock_id: stock_id)
        return quote if quote[:price]

        Twse::RealtimeQuoteFetcher.new.call(stock_id: stock_id)
      rescue FinMind::Client::Error => e
        Rails.logger.warn("IntradayQuotesController#latest: FinMind failed for #{stock_id}: #{e.message}")
        Twse::RealtimeQuoteFetcher.new.call(stock_id: stock_id)
      end
    end
  end
end
