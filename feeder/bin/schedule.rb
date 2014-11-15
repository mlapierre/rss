require './config/boot'
require './config/environment'
require 'clockwork'
require_relative '../lib/feeder/feeder'
require_relative '../lib/feeder/jobs/update_feed_job'
require_relative '../lib/feeder/jobs/store_entry_html_job'

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end

  every(1.hour, 'update_feeds') do
    feeder = Feeder.new
    feeder.update_feeds
  end
end
