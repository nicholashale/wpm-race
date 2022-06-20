class CreateRaces < ActiveRecord::Migration[7.0]
  def change
    create_table :races do |t|
      t.string :text
      t.string :lobby_code

      t.timestamps
    end
  end
end
