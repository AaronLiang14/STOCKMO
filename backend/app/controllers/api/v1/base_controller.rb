module Api
  module V1
    class BaseController < ApplicationController
      rescue_from FinMind::Client::Error do |error|
        render json: { error: error.message }, status: :bad_gateway
      end
    end
  end
end
