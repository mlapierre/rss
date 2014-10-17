class ChangeShortColumnsToText < ActiveRecord::Migration
  def change
    change_column :entries, :content, :text
    change_column :entries, :summary, :text
  end
end
