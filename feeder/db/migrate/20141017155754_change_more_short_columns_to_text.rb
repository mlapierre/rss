class ChangeMoreShortColumnsToText < ActiveRecord::Migration
  def change
    change_column :entries, :title, :text
    change_column :entries, :url, :text
    change_column :entries, :image, :text
    change_column :entries, :author, :text
    change_column :feeds, :title, :text
    change_column :feeds, :subtitle, :text
    change_column :feeds, :description, :text
    change_column :feeds, :icon, :text
    change_column :feeds, :feed_link, :text
    change_column :feeds, :source_link, :text
  end
end
