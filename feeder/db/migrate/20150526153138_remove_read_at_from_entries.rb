class RemoveReadAtFromEntries < ActiveRecord::Migration
  def change
    remove_column :entries, :read_at
  end
end
