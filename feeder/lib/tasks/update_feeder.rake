require_relative '../../lib/feeder/feeder'

desc 'Update all subscribed feeds'
task :update_feeder => :environment do
  Feeder.update_feeds
end