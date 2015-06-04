class FixEntryIdInUserArticleTags < ActiveRecord::Migration
  def change
    change_table :user_article_tags do |t|
      t.rename :user_entry_id, :entry_id
    end
  end
end
