class StockPer < ApplicationRecord
  validates :stock_id, :date, presence: true
  validates :stock_id, uniqueness: { scope: :date }

  # Mirrors the field names FinMind's own API returns, so the frontend
  # can keep parsing the same shape it always has.
  def as_finmind_json
    {
      date: date.to_s,
      stock_id: stock_id,
      dividend_yield: dividend_yield&.to_f,
      PER: per&.to_f,
      PBR: pbr&.to_f,
    }
  end
end
