class CreateIntradayQuotes < ActiveRecord::Migration[8.1]
  def change
    create_table :intraday_quotes do |t|
      t.string :stock_id, null: false
      t.datetime :quoted_at, null: false
      t.decimal :price, precision: 12, scale: 4
      t.decimal :open, precision: 12, scale: 4
      t.decimal :high, precision: 12, scale: 4
      t.decimal :low, precision: 12, scale: 4
      t.decimal :previous_close, precision: 12, scale: 4
      t.bigint :volume

      t.timestamps
    end

    add_index :intraday_quotes, [ :stock_id, :quoted_at ], unique: true
  end
end
