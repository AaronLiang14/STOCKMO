class CreateStockPrices < ActiveRecord::Migration[8.1]
  def change
    create_table :stock_prices do |t|
      t.string :stock_id, null: false
      t.date :date, null: false
      t.decimal :open, precision: 12, scale: 4
      t.decimal :max, precision: 12, scale: 4
      t.decimal :min, precision: 12, scale: 4
      t.decimal :close, precision: 12, scale: 4
      t.bigint :trading_volume

      t.timestamps
    end

    add_index :stock_prices, [ :stock_id, :date ], unique: true
  end
end
