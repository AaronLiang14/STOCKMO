module Twse
  # Maps TWSE's terse single-letter quote fields (z=price, y=previous
  # close, d/t=date/time, o/h/l=open/high/low, v=volume) into named
  # values.
  class RealtimeQuoteFetcher
    def initialize(client: Client.new)
      @client = client
    end

    def call(stock_id:)
      raw = @client.fetch_quote(stock_id: stock_id)

      {
        stock_id: stock_id,
        price: decimal(raw["z"]) || decimal(raw["oz"]) || decimal(raw["pz"]),
        open: decimal(raw["o"]),
        high: decimal(raw["h"]),
        low: decimal(raw["l"]),
        previous_close: decimal(raw["y"]),
        volume: raw["v"].presence&.to_i,
        quoted_at: parse_time(raw["d"], raw["t"]),
      }
    end

    private

    def decimal(value)
      return nil if value.blank? || value == "-"
      BigDecimal(value)
    end

    def parse_time(date_str, time_str)
      return nil if date_str.blank? || time_str.blank?
      Time.zone.strptime("#{date_str} #{time_str}", "%Y%m%d %H:%M:%S")
    rescue ArgumentError
      nil
    end
  end
end
