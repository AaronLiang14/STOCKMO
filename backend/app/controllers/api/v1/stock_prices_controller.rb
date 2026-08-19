module Api
  module V1
    class StockPricesController < BaseController
      def index
        scope = StockPrice.where(stock_id: params.require(:data_id)).order(:date)
        scope = scope.where(date: params[:start_date]..) if params[:start_date].present?
        scope = scope.where(date: ..params[:end_date]) if params[:end_date].present?

        render json: { data: scope.map(&:as_finmind_json) }
      end
    end
  end
end
