class AddUpdatedToUserEntries < ActiveRecord::Migration
  def change
    add_column :user_entries, :updated_at, :datetime
  end
end
