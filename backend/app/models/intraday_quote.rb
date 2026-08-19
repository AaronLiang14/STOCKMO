class IntradayQuote < ApplicationRecord
  validates :stock_id, :quoted_at, presence: true
  validates :stock_id, uniqueness: { scope: :quoted_at }

  # Shape matches what the frontend already expects from FinMind's
  # TaiwanStockKBar dataset, so LatestPrice.tsx needs no changes.
  def as_kbar_json
    {
      date: quoted_at.to_date.to_s,
      minute: quoted_at.strftime("%H:%M:%S"),
      close: price&.to_f,
    }
  end
end
