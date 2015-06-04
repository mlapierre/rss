class UserEntry < ActiveRecord::Base
  belongs_to :entry
  has_many :user_article_tags
  has_many :article_tags, through: :user_article_tags
end
