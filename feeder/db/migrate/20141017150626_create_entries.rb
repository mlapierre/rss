class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title
      t.string :url
      t.string :author
      t.string :content
      t.string :summary
      t.string :image
      t.datetime :updated
      t.datetime :published
    end
  end
end
