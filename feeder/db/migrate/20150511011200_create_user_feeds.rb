class CreateUserFeeds < ActiveRecord::Migration
  def change
    create_table :user_feeds do |t|
      t.references :feed, index: true
      t.integer :parent_id
      t.integer :order
    end
  end
end
