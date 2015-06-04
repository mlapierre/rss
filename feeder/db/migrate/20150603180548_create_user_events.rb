class CreateUserEvents < ActiveRecord::Migration
  def change
    create_table :user_events do |t|
      t.string :event_name
    end
  end
end
