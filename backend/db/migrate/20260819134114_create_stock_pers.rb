class CreateStockPers < ActiveRecord::Migration[8.1]
  def change
    create_table :stock_pers do |t|
      t.string :stock_id, null: false
      t.date :date, null: false
      t.decimal :dividend_yield, precision: 12, scale: 4
      t.decimal :per, precision: 12, scale: 4
      t.decimal :pbr, precision: 12, scale: 4

      t.timestamps
    end

    add_index :stock_pers, [ :stock_id, :date ], unique: true
  end
end
