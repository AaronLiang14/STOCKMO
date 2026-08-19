class AddMissingFieldsToStockPrices < ActiveRecord::Migration[8.1]
  def change
    add_column :stock_prices, :trading_money, :bigint
    add_column :stock_prices, :spread, :decimal, precision: 12, scale: 4
    add_column :stock_prices, :trading_turnover, :bigint
  end
end
