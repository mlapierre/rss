class UserArticleTag < ActiveRecord::Base
  belongs_to :entry
  belongs_to :article_tag
end
