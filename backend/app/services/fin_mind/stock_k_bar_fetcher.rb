module FinMind
  # Paid-tier per-minute K-bar dataset — returns the whole day's bars in
  # one call, unlike TWSE's snapshot-only free endpoint.
  class StockKBarFetcher
    def initialize(client: Client.new)
      @client = client
    end

    def call(stock_id:, date: Date.current.to_s)
      @client.fetch(dataset: "TaiwanStockKBar", data_id: stock_id, start_date: date, end_date: date)
    end
  end
end
