module Api
  module V1
    class StockPersController < BaseController
      # Watchlist stocks are kept warm by SyncStockPersJob; any other
      # stock is synced from FinMind on first request and cached from
      # then on.
      def index
        stock_id = params.require(:data_id)
        scope = stock_per_scope(stock_id)

        if scope.empty?
          sync(stock_id)
          scope = stock_per_scope(stock_id)
        end

        render json: { data: scope.map(&:as_finmind_json) }
      end

      private

      def stock_per_scope(stock_id)
        scope = StockPer.where(stock_id: stock_id).order(:date)
        scope = scope.where(date: params[:start_date]..) if params[:start_date].present?
        scope = scope.where(date: ..params[:end_date]) if params[:end_date].present?
        scope
      end

      def sync(stock_id)
        StockPers::SyncService.new.call(
          stock_id: stock_id,
          start_date: params[:start_date].presence || 5.years.ago.to_date.to_s,
          end_date: params[:end_date].presence || Date.current.to_s,
        )
      rescue FinMind::Client::Error => e
        Rails.logger.warn("StockPersController: FinMind sync failed for #{stock_id}: #{e.message}")
      end
    end
  end
end
