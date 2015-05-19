class CreateUserFeedTags < ActiveRecord::Migration
  def change
    create_table :user_feed_tags do |t|
      t.references :feeds, index: true
      t.references :tags, index: true
    end
  end
end
