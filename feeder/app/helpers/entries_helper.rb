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

end
