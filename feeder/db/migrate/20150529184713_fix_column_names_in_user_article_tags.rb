class FixColumnNamesInUserArticleTags < ActiveRecord::Migration
  def change
    change_table :user_article_tags do |t|
      t.rename :user_entries_id, :user_entry_id
      t.rename :article_tags_id, :article_tag_id
    end
  end
end
