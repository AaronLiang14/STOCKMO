module DailyPrices
  class SyncService
    def initialize(fetcher: FinMind::StockPriceFetcher.new)
      @fetcher = fetcher
    end

    def call(stock_id:, start_date:, end_date: Date.current.to_s)
      rows = @fetcher.call(stock_id: stock_id, start_date: start_date, end_date: end_date)

      rows.each do |row|
        StockPrice.upsert(
          {
            stock_id: row["stock_id"],
            date: row["date"],
            open: row["open"],
            max: row["max"],
            min: row["min"],
            close: row["close"],
            trading_volume: row["Trading_Volume"],
            trading_money: row["Trading_money"],
            spread: row["spread"],
            trading_turnover: row["Trading_turnover"]
          },
          unique_by: [ :stock_id, :date ],
        )
      end
    end
  end
end
