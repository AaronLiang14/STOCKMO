module FinMind
  # Paid-tier tick snapshot endpoint — same normalized shape as
  # Twse::RealtimeQuoteFetcher so callers can fall back between the two.
  class RealtimeQuoteFetcher
    def initialize(client: Client.new)
      @client = client
    end

    def call(stock_id:)
      raw = @client.fetch_tick_snapshot(data_id: stock_id).first
      return {} unless raw

      price = decimal(raw["close"])
      change_price = decimal(raw["change_price"])

      {
        stock_id: stock_id,
        price: price,
        open: decimal(raw["open"]),
        high: decimal(raw["high"]),
        low: decimal(raw["low"]),
        previous_close: price && change_price ? price - change_price : nil,
        volume: raw["total_volume"].presence&.to_i,
        quoted_at: parse_time(raw["date"])
      }
    end

    private

    def decimal(value)
      return nil if value.nil?
      BigDecimal(value.to_s)
    end

    def parse_time(date_str)
      return nil if date_str.blank?
      Time.zone.parse(date_str)
    rescue ArgumentError
      nil
    end
  end
end
