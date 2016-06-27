class CreateSaldoInfos < ActiveRecord::Migration
  def change
    create_table :saldo_infos do |t|
      t.float :valor
      t.date :date

      t.timestamps null: false
    end
  end
end
