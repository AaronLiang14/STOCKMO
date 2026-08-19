require "net/http"
require "json"

module FinMind
  class Client
    class Error < StandardError; end

    BASE_URL = "https://api.finmindtrade.com/api/v4/data"

    def initialize(token: ENV.fetch("FINMIND_TOKEN"))
      @token = token
    end

    def fetch(dataset:, data_id: nil, start_date: nil, end_date: nil)
      params = { dataset: dataset, data_id: data_id, start_date: start_date, end_date: end_date }.compact
      get(BASE_URL, params)
    end

    private

    def get(base_url, params)
      uri = URI(base_url)
      uri.query = URI.encode_www_form(params.merge(token: @token))

      response = Net::HTTP.get_response(uri)
      raise Error, "FinMind request failed: HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)

      body = JSON.parse(response.body)
      raise Error, "FinMind error: #{body["msg"]}" unless body["status"] == 200

      body["data"]
    end
  end
end
