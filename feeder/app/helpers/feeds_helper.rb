require 'nokogiri'
require 'open-uri'

module FeedsHelper

  # Fetch the feed and return a representative JSON object
  def self.parse_feed(link)
    xml = fetch_feed(link)
    feed = Feed.new
    feed.title = xml.xpath('(//title)[1]').text
    feed.description = xml.xpath('(//description)[1]').text
    feed.updated = xml.xpath('//lastBuildDate').text

    feed.feed_link = link #TODO check if the link found in the xml doesn't match the url
    feed.xml = xml
    feed
  end

private
  def self.fetch_feed(link)
    Nokogiri::XML(open(link))
  end
end
