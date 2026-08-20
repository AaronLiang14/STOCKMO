module Api
  module V1
    class IntradayQuotesController < BaseController
      rescue_from Twse::Client::Error do |error|
        render json: { error: error.message }, status: :bad_gateway
      end

      # Today's (or a given date's) accumulated quotes for a stock —
      # only has data from whenever PollIntradayQuotesJob started
      # collecting it onward, since TWSE doesn't provide free
      # historical intraday bars.
      def index
        date = params[:date].present? ? Date.parse(params[:date]) : Date.current
        scope = IntradayQuote
          .where(stock_id: params.require(:data_id))
          .where(quoted_at: date.beginning_of_day..date.end_of_day)
          .order(:quoted_at)

        render json: { data: scope.map(&:as_kbar_json) }
      end

      # Live snapshot straight from TWSE (not the DB) — powers the
      # stock header's current price, high/low, volume, and change.
      def latest
        quote = Twse::RealtimeQuoteFetcher.new.call(stock_id: params.require(:data_id))

        change_price = nil
        change_rate = nil
        if quote[:price] && quote[:previous_close]&.nonzero?
          change_price = (quote[:price] - quote[:previous_close]).round(2)
          change_rate = (change_price / quote[:previous_close] * 100).round(2)
        end

        render json: {
          data: [
            {
              close: quote[:price]&.to_f,
              change_price: change_price&.to_f,
              change_rate: change_rate&.to_f,
              high: quote[:high]&.to_f,
              low: quote[:low]&.to_f,
              total_volume: quote[:volume]
            }
          ]
        }
      end
    end
  end
end
