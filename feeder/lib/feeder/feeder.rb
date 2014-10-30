require 'log4r'
require 'log4r/yamlconfigurator'
require 'log4r/outputter/datefileoutputter'

include Log4r

class Feeder

  def initialize
    Log4r::YamlConfigurator.load_yaml_file("#{Dir.pwd}/config/log4r.yml")
    @log = Log4r::Logger["Feeder"]
    mech_log = Log4r::Logger["Feeder Mechanized"]
    FeedsHelper.log = @log
    EntriesHelper.log = mech_log
  end

  def update_feeds
    @log.info "Updating feeds..."
    Feed.find_each.with_index do |feed, index|
      # TODO allow update frequency to be restricted
      @log.debug "Fetching: #{feed.title} [#{index+1}/#{Feed.count}]"
      feed_source = FeedsHelper.fetch_feed_source(feed.feed_link)
      if !feed_source.respond_to? :feed_url #TODO more appropriate error handling
        @log.warn "Invalid feed. Request returned: #{feed_source.to_s}"
        next
      end

      # TODO don't bother processing the entries if the feed hasn't been updated since last fetched
      EntriesHelper.save_from(feed_source, feed)
    end
    @log.info "Update complete"
  end

  def import_opml_from(file)
    @log.info "Importing opml: #{file}"
    FeedsHelper.import_opml_from(file)
  end

end