class CreateArticleTags < ActiveRecord::Migration
  def change
    create_table :article_tags do |t|
      t.string :name

      t.timestamps
    end
  end
end
