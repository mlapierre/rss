class AddOrderToUserFeedTags < ActiveRecord::Migration
  def change
    add_column :user_feed_tags, :order, :integer
  end
end
