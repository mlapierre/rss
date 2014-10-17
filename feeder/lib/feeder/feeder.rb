class Feeder
  def initialize
  end

  def update_feeds
    Feed.find_each do |feed|
      feed_source = FeedsHelper.fetch_feed_source(feed.feed_link)
      EntriesHelper.save_from(feed_source, feed)
    end
  end

end