class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title
      t.string :link
      t.string :description
      t.string :author
      t.datetime :pub_date
    end
  end
end
