class Entry < ActiveRecord::Base
  belongs_to :feed
  has_many :user_entries

  has_many :user_article_tags
  has_many :article_tags, through: :user_article_tags
end
