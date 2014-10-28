require 'feedjira'
require 'opml-parser'

include OpmlParser

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

  def self.import_opml(content)
    OpmlParser.import(content)
  end

end
