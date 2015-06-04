class UserArticleTag < ActiveRecord::Base
  belongs_to :user_entries
  belongs_to :article_tags
end
