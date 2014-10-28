class Feeder

  def self.update_feeds
    puts "Updating feeds..."
    Feed.find_each do |feed|
      # TODO allow update frequency to be restricted
      feed_source = FeedsHelper.fetch_feed_source(feed.feed_link)
      
      # TODO don't bother processing the entries if the feed hasn't been updated since last fetched
      EntriesHelper.save_from(feed_source, feed)
    end
  end

  def self.import_opml_from(file)
    puts "Importing opml: #{file}"
    FeedsHelper.import_opml_from(file)
  end

end