require 'feedjira'

module FeedsHelper

  def self.bulk_fetch_and_parse(links)
    Feedjira::Feed.fetch_and_parse links
  end

  def self.fetch_and_parse(link)
    Feedjira::Feed.fetch_and_parse link
  end

  def self.fetch_feed_source(link)
    FeedsHelper.fetch_and_parse link
  end

end
