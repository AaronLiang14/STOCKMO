require "net/http"
require "json"

module Twse
  # Taiwan Stock Exchange's own free, unauthenticated real-time quote
  # endpoint (the same one mis.twse.com.tw's site uses). No API key,
  # no free-tier gating — but it only ever returns the *current*
  # snapshot, not historical intraday bars.
  class Client
    class Error < StandardError; end

    QUOTE_URL = "https://mis.twse.com.tw/stock/api/getStockInfo.jsp"

    def fetch_quote(stock_id:, market: "tse")
      uri = URI(QUOTE_URL)
      uri.query = URI.encode_www_form(ex_ch: "#{market}_#{stock_id}.tw", json: 1, delay: 0)

      request = Net::HTTP::Get.new(uri)
      request["Referer"] = "https://mis.twse.com.tw/stock/index.jsp"
      request["User-Agent"] = "Mozilla/5.0"

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
      raise Error, "TWSE request failed: HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)

      body = JSON.parse(response.body)
      quote = body["msgArray"]&.first
      raise Error, "No quote returned for #{stock_id}" unless quote

      quote
    end
  end
end
