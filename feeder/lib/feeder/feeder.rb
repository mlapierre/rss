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
    # TODO allow update frequency to be restricted
    @log.info "Queuing feeds..."
    Feed.find_each.with_index do |feed, index|
      @log.debug "Queuing: #{feed.title} [#{index+1}/#{Feed.count}]"
      async_update_feed(feed.id)
    end
    @log.info "All feeds queued"
  end

  def async_update_feed(feed_id)
    Resque.enqueue(UpdateFeedJob, feed_id)
  end

  def import_opml_from(file)
    @log.info "Importing opml: #{file}"
    FeedsHelper.import_opml_from(file)
  end

end