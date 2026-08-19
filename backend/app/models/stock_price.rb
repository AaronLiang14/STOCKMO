class StockPrice < ApplicationRecord
  validates :stock_id, :date, presence: true
  validates :stock_id, uniqueness: { scope: :date }

  # Mirrors the field names FinMind's own API returns, so the frontend
  # can keep parsing the same shape it always has.
  def as_finmind_json
    {
      date: date.to_s,
      stock_id: stock_id,
      open: open&.to_f,
      max: max&.to_f,
      min: min&.to_f,
      close: close&.to_f,
      spread: spread&.to_f,
      Trading_Volume: trading_volume,
      Trading_money: trading_money,
      Trading_turnover: trading_turnover,
    }
  end
end
