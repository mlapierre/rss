class AddReadAtToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :read_at, :datetime
  end
end
