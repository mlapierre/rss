require_relative '../../lib/feeder/feeder'
require_relative '../../app/models/feed'
require_relative '../../app/models/entry'

desc 'Update all subscribed feeds'
task :update_feeder => :environment do |t, args|
  feeder = Feeder.new
  feeder.update_feeds
end