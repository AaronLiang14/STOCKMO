module Api
  module V1
    class TickSnapshotsController < BaseController
      def show
        data = FinMind::Client.new.fetch_tick_snapshot(data_id: params.require(:data_id))
        render json: { data: data }
      end
    end
  end
end
