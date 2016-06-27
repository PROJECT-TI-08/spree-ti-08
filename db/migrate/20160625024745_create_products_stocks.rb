class CreateProductsStocks < ActiveRecord::Migration
  def change
    create_table :products_stocks do |t|
      t.string :sku
      t.string :store
      t.integer :qty
      t.date :date

      t.timestamps null: false
    end
  end
end
