class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.references :entry, index: true
      t.text :url
      t.text :title
      t.text :content
      t.datetime :retrieved_at

      t.timestamps
    end
  end
end
