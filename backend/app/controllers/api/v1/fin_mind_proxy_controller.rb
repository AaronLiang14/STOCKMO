module Api
  module V1
    # Passes datasets through to FinMind server-side so the API token never
    # ships in the frontend bundle. Used for datasets that don't need local
    # caching/scheduled sync (news, financial statements, etc.) — StockPrice
    # and StockPer get the full DB-backed treatment instead (see
    # Api::V1::StockPricesController / StockPersController).
    class FinMindProxyController < BaseController
      ALLOWED_DATASETS = %w[
        TaiwanStockNews
        TaiwanStockFinancialStatements
        TaiwanStockTradingDailyReport
        TaiwanStockMonthRevenue
        TaiwanStockKBar
        TaiwanVariousIndicators5Seconds
      ].freeze

      def show
        dataset = params.require(:dataset)
        head :not_found and return unless ALLOWED_DATASETS.include?(dataset)

        data = FinMind::Client.new.fetch(
          dataset: dataset,
          data_id: params[:data_id],
          start_date: params[:start_date],
          end_date: params[:end_date],
        )

        render json: { data: data }
      end
    end
  end
end
