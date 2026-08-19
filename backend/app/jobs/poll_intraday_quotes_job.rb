class PollIntradayQuotesJob < ApplicationJob
  queue_as :default

  def perform(stock_ids: Watchlist::STOCK_IDS)
    stock_ids.each do |stock_id|
      IntradayQuotes::SyncService.new.call(stock_id: stock_id)
    rescue Twse::Client::Error => e
      Rails.logger.warn("PollIntradayQuotesJob: #{stock_id} failed: #{e.message}")
    end
  end
end
