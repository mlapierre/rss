require 'feedjira'
require 'opml-parser'

include OpmlParser

module FeedsHelper

  mattr_accessor :log

  def self.add(link)
    if Feed.find_by(feed_link: link).nil?
      feed_source = FeedsHelper.fetch_feed_source(link)

      @feed = Feed.new
      @feed.title = feed_source.title
      @feed.description = feed_source.description
      @feed.updated = feed_source.last_modified

      @feed.feed_link = feed_source.feed_url #TODO check if the link found in the xml doesn't match the url
      @feed.source_link = feed_source.url

      if @feed.save
        EntriesHelper.save_from(feed_source, @feed)
        FeedsHelper.updateUnreadCountForOne @feed
        @feed
      end
    end
  end

  def self.bulk_fetch_and_parse(links)
    Feedjira::Feed.fetch_and_parse links
  end

  def self.fetch_and_parse(link)
    Feedjira::Feed.fetch_and_parse link
  end

  def self.fetch_feed_source(link)
    feed_source = FeedsHelper.fetch_and_parse link
    log.warn "Invalid feed. Request returned: #{feed_source.to_s}" if !feed_source.respond_to? :feed_url #TODO more appropriate error handling
    feed_source
  end

  def self.getTagsAndFeeds
    Tag.all
  end

  def self.getUntaggedFeeds
    Feed.includes(:user_feed_tags).where(user_feed_tags: { feed_id: nil })
  end

  def self.import_opml_from(file)
    log.debug "Reading opml content from file"
    content = File.open(file).readlines.each { |x| x.strip! }.join("\n")
    FeedsHelper.import_opml(content + "\n")
  end

  def self.import_opml(content)
    log.debug "Parsing opml"
    opml = OpmlParser.import(content)
    opml.each do |outline|
      if !outline.attributes.include? :xmlUrl
        log.info "Skipping #{outline.attributes[:title]}" if outline.attributes.include? :title
        next
      end
      feed = Feed.find_by feed_link: outline.attributes[:xmlUrl]
      if !feed.nil?
        log.info "Skipping #{outline.attributes[:xmlUrl]}"
        next
      end

      log.info "Importing #{outline.attributes[:xmlUrl]}"
      feed_source = FeedsHelper.fetch_and_parse(outline.attributes[:xmlUrl])
      if !feed_source.respond_to? :feed_url #TODO more appropriate error handling
        log.warn "Invalid feed. Request returned: #{feed_source.to_s}"
        next
      end

      feed = Feed.new
      feed.title = feed_source.title
      feed.description = feed_source.description
      feed.updated = feed_source.last_modified

      feed.feed_link = feed_source.feed_url #TODO check if the link found in the xml doesn't match the url
      feed.source_link = feed_source.url

      if feed.save
        log.debug "Saving feed entries..."
        EntriesHelper.save_from(feed_source, feed)
      end
    end
  end

  def self.tagFeed(feed_id, tag_name_or_id)
    feed = Feed.find_by_id feed_id
    if !feed.nil?
      tag = Tag.find_by_id(tag_name_or_id) || Tag.find_by(name: tag_name_or_id)
      if !tag.nil?
        feed_tags = UserFeedTag.new

        feed_tags.feed_id = feed_id
        feed_tags.tag_id = tag.id
        if feed_tags.save
          feed_tags
        end
      end
    end
  end

  def self.updateUnreadCount
    FeedsHelper.updateUnreadCountForAll
  end

  def self.updateUnreadCountForOne(feed)
    last_updated = UserEntry.group(:entry_id).maximum(:updated_at)
    is_read = UserEntry.select(:entry_id).where(entry_id: last_updated.keys, updated_at: last_updated.values).where.not(read_at: nil)

    user_feed = UserFeed.find_or_create_by feed_id: feed.id
    user_feed.unread = Entry.where.not(id: is_read).where(feed_id: feed.id).size
    user_feed.save
  end

  def self.updateUnreadCountForAll
    feeds = Feed.all
    last_updated = UserEntry.group(:entry_id).maximum(:updated_at)
    is_read = UserEntry.select(:entry_id).where(entry_id: last_updated.keys, updated_at: last_updated.values).where.not(read_at: nil)

    feeds.each do |feed|
      user_feed = UserFeed.find_or_create_by feed_id: feed.id
      user_feed.unread = Entry.where.not(id: is_read).where(feed_id: feed.id).size
      user_feed.save
    end
  end

end
