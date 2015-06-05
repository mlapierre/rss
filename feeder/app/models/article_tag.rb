class ArticleTag < ActiveRecord::Base
  has_many :user_article_tags
  has_many :entries, through: :user_article_tags
end
