class UpdateFeedJob
  include SuckerPunch::Job

  def perform(feed_id)
    ActiveRecord::Base.connection_pool.with_connection do
      feed = Feed.find(feed_id)
      feed_source = FeedsHelper.fetch_feed_source(feed.feed_link)
      next if !feed_source.respond_to? :feed_url #TODO more appropriate error handling

      # TODO don't bother processing the entries if the feed hasn't been updated since last fetched
      EntriesHelper.save_from(feed_source, feed)
    end
  end
end