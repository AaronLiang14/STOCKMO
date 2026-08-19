# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_19_143812) do
  create_table "stock_pers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.decimal "dividend_yield", precision: 12, scale: 4
    t.decimal "pbr", precision: 12, scale: 4
    t.decimal "per", precision: 12, scale: 4
    t.string "stock_id", null: false
    t.datetime "updated_at", null: false
    t.index ["stock_id", "date"], name: "index_stock_pers_on_stock_id_and_date", unique: true
  end

  create_table "stock_prices", force: :cascade do |t|
    t.decimal "close", precision: 12, scale: 4
    t.datetime "created_at", null: false
    t.date "date", null: false
    t.decimal "max", precision: 12, scale: 4
    t.decimal "min", precision: 12, scale: 4
    t.decimal "open", precision: 12, scale: 4
    t.decimal "spread", precision: 12, scale: 4
    t.string "stock_id", null: false
    t.bigint "trading_money"
    t.bigint "trading_turnover"
    t.bigint "trading_volume"
    t.datetime "updated_at", null: false
    t.index ["stock_id", "date"], name: "index_stock_prices_on_stock_id_and_date", unique: true
  end
end
