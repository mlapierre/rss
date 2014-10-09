class ChangeDetailsInFeeds < ActiveRecord::Migration
  def change
    remove_column :feeds, :summary, :string
    remove_column :feeds, :entry, :string
    remove_column :feeds, :published, :datetime
    remove_column :feeds, :author, :string
    remove_column :feeds, :feed, :string
    remove_column :feeds, :link, :string
    add_column :feeds, :subtitle, :string
    add_column :feeds, :icon, :string
    add_column :feeds, :description, :string
    add_column :feeds, :feed_link, :string
    add_column :feeds, :source_link, :string
  end
end

