module FinMind
  class StockPerFetcher
    def initialize(client: Client.new)
      @client = client
    end

    def call(stock_id:, start_date:, end_date: Date.current.to_s)
      @client.fetch(
        dataset: "TaiwanStockPER",
        data_id: stock_id,
        start_date: start_date,
        end_date: end_date,
      )
    end
  end
end
