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

      # Fetch the full HTML of the entry
      log.info "Saving entry: #{entry.title} (#{entry.url})"
      if entry.save
        agent = Mechanize.new
        agent.user_agent_alias = 'Windows Chrome'
        agent.log = log
        page_source = agent.get(entry.url)
        if page_source.respond_to?('content') && 
          !page_source.content.to_s.empty? && 
           page_source.respond_to?('content_type') &&
           page_source.content_type.start_with?('text/html') 
          page = Page.new
          page.entry_id = entry.id
          page.url = entry.url
          page.title = entry.title
          page_source.encoding = 'utf-8'
          page.content = page_source.content
          page.retrieved_at = Time.now
          page.save
        else
          log.warn "Unable to retrieve content of: #{entry.url}"
        end
      end
    end
  end

end
