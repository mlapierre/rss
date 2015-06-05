require 'feedjira'
require 'mechanize'

module EntriesHelper

  mattr_accessor :log

  def self.save_from(feed_source, feed)
    feed_source.entries.each do |source_entry|
      entry = Entry.find_by url: source_entry.url
      next if !entry.nil?

      entry = Entry.new
      entry.feed_id = feed.id
      entry.title = source_entry.title
      entry.url = source_entry.url
      entry.author = source_entry.author
      entry.content = source_entry.content
      entry.summary = source_entry.summary
      entry.image = source_entry.image if source_entry.respond_to? 'image'
      entry.updated = source_entry.updated if source_entry.respond_to? 'updated'
      entry.published = source_entry.published

      if entry.save
        EntriesHelper.async_store_entry_html(entry.id, entry.url, entry.title)
      end
    end
  end

  # Fetch the full HTML of the entry
  def self.async_store_entry_html(id, url, title)
    Resque.enqueue(StoreEntryHTMLJob, id, url, title)
  end

  def self.tagArticle(entry_id, tag_name)
    # If the entry is already tagged with this tag_name, return the user article tag record
    tag = ArticleTag.includes(:user_article_tags)
                    .where(user_article_tags: {entry_id: entry_id}, name: tag_name)
    if tag.size != 0
      uat = UserArticleTag.find_by entry_id: entry_id, article_tag_id: tag.first.id
      return { response_status: "tag exists", 
                 response_code: 409, 
                  response_msg: %Q{The tag "#{tag_name}" is already applied to that article},
                           tag: uat }
    end

    # Otherwise tag it
    tag = ArticleTag.find_or_create_by name: tag_name
    uat = UserArticleTag.new entry_id: entry_id, article_tag_id: tag.id
    uat.save
    uat
  end

  def self.removeTagFromArticle(entry_id, tag_name)
    uat = UserArticleTag.includes(:article_tag).where(entry_id: entry_id, article_tags: {name: tag_name})
    uat.first.destroy
  end

end
