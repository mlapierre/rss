class Feed < ActiveRecord::Base
  attr_accessor :xml, :unread_count

  has_many :entries
  has_many :user_feed_tags
  has_many :tags, through: :user_feed_tags
  has_many :user_feeds
end
