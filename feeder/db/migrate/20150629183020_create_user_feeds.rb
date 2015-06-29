class CreateUserFeeds < ActiveRecord::Migration
  def change
    create_table :user_feeds do |t|
      t.references :feed, index: true
      t.integer :unread
      t.integer :sort_order
    end
  end
end
