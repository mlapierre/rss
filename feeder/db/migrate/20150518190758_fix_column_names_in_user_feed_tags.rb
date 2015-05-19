class FixColumnNamesInUserFeedTags < ActiveRecord::Migration
  def change
    change_table :user_feed_tags do |t|
      t.rename :feeds_id, :feed_id
      t.rename :tags_id, :tag_id
    end
  end
end
