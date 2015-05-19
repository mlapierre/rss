class Tag < ActiveRecord::Base
  has_many :user_feed_tags
  has_many :feeds, through: :user_feed_tags
end
