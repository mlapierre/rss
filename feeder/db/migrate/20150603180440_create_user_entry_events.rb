class CreateUserEntryEvents < ActiveRecord::Migration
  def change
    create_table :user_entry_events do |t|
      t.references :entry_id, index: true
      t.references :user_event_id, index: true
      t.datetime :occurred_at
    end
  end
end
