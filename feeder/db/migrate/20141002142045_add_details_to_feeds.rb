class AddDetailsToFeeds < ActiveRecord::Migration
  def change
    add_column :feeds, :feed, :string
    add_column :feeds, :author, :string
    add_column :feeds, :summary, :string
    add_column :feeds, :entry, :string
    add_column :feeds, :updated, :datetime
    add_column :feeds, :published, :datetime
  end
end
