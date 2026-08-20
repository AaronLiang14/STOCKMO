module StockPers
  class SyncService
    def initialize(fetcher: FinMind::StockPerFetcher.new)
      @fetcher = fetcher
    end

    def call(stock_id:, start_date:, end_date: Date.current.to_s)
      rows = @fetcher.call(stock_id: stock_id, start_date: start_date, end_date: end_date)

      rows.each do |row|
        StockPer.upsert(
          {
            stock_id: row["stock_id"],
            date: row["date"],
            dividend_yield: row["dividend_yield"],
            per: row["PER"],
            pbr: row["PBR"]
          },
          unique_by: [ :stock_id, :date ],
        )
      end
    end
  end
end
