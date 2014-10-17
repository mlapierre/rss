require 'feedjira'

module EntriesHelper

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
      entry.image = source_entry.image
      entry.updated = source_entry.updated
      entry.published = source_entry.published
      entry.save
    end
  end

end
