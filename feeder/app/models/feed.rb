class Feed < ActiveRecord::Base
  attr_accessor :xml

  has_many :user_feed_tags
  has_many :tags, through: :user_feed_tags
end
