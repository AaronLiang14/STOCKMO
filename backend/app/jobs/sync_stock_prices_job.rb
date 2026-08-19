class SyncStockPricesJob < ApplicationJob
  queue_as :default

  def perform(stock_ids: Watchlist::STOCK_IDS, start_date: 30.days.ago.to_date.to_s)
    stock_ids.each do |stock_id|
      DailyPrices::SyncService.new.call(stock_id: stock_id, start_date: start_date)
    end
  end
end
