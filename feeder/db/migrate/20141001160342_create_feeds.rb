class CreateFeeds < ActiveRecord::Migration
  def change
    create_table :feeds do |t|
      t.string :link
      t.string :title

      t.timestamps
    end
  end
end
