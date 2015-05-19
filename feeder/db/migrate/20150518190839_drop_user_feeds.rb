class DropUserFeeds < ActiveRecord::Migration
  def change
    drop_table :user_feeds
  end
end
