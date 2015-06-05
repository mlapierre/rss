class CreateUserArticleTags < ActiveRecord::Migration
  def change
    create_table :user_article_tags do |t|
      t.references :user_entries, index: true
      t.references :article_tags, index: true

      t.timestamps
    end
  end
end
