class CreateUserEntries < ActiveRecord::Migration
  def change
    create_table :user_entries do |t|
      t.datetime :read_at
      t.references :entry, index: true
    end
  end
end
