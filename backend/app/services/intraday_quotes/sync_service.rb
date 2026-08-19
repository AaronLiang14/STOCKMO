module IntradayQuotes
  class SyncService
    def initialize(fetcher: Twse::RealtimeQuoteFetcher.new)
      @fetcher = fetcher
    end

    def call(stock_id:)
      quote = @fetcher.call(stock_id: stock_id)
      return if quote[:price].nil? || quote[:quoted_at].nil?

      IntradayQuote.upsert(
        quote.slice(:stock_id, :quoted_at, :price, :open, :high, :low, :previous_close, :volume),
        unique_by: [ :stock_id, :quoted_at ],
      )
    end
  end
end
