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

  def self.import_opml_from(file)
    content = File.open(file).readlines.each { |x| x.strip! }.join("\n")
    FeedsHelper.import_opml(content + "\n")
  end

  def self.import_opml(content)
    opml = OpmlParser.import(content)
    opml.each do |outline|
      if !outline.attributes.include? :xmlUrl
        puts "Skipping #{outline.attributes[:title]}" if outline.attributes.include? :title
        next
      end
      feed = Feed.find_by feed_link: outline.attributes[:xmlUrl]
      if !feed.nil?
        puts "Skipping #{outline.attributes[:xmlUrl]}"
        next
      end

      puts "Importing #{outline.attributes[:xmlUrl]}"
      feed_source = FeedsHelper.fetch_and_parse(outline.attributes[:xmlUrl]) 
      next unless feed_source.respond_to? :feed_url #TODO more appropriate error handling
      
      feed = Feed.new
      feed.title = feed_source.title
      feed.description = feed_source.description
      feed.updated = feed_source.last_modified

      feed.feed_link = feed_source.feed_url #TODO check if the link found in the xml doesn't match the url
      feed.source_link = feed_source.url

      if feed.save
        EntriesHelper.save_from(feed_source, feed)      
      end
    end
  end

end
