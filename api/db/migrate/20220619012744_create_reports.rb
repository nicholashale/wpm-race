class CreateReports < ActiveRecord::Migration[7.0]
  def change
    create_table :reports do |t|
      t.integer :user_id
      t.integer :race_id
      t.integer :time_ms
      t.float :accuracy_percent
      t.integer :place

      t.timestamps
    end
  end
end
