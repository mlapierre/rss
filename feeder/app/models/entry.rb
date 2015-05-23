class Entry < ActiveRecord::Base
  belongs_to :feed
  has_many :user_entries
end
