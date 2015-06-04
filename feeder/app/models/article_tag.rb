class ArticleTag < ActiveRecord::Base
  has_many :user_article_tags
end
