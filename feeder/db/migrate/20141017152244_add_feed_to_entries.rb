class AddFeedToEntries < ActiveRecord::Migration
  def change
    add_reference :entries, :feed, index: true
  end
end
