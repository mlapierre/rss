desc 'Update the unread count for each feed'
task :update_unread => :environment do
  feeds = Feed.all
  last_updated = UserEntry.group(:entry_id).maximum(:updated_at)
  is_read = UserEntry.select(:entry_id).where(entry_id: last_updated.keys, updated_at: last_updated.values).where.not(read_at: nil)

  feeds.each do |feed|
    count = Entry.where.not(id: is_read).where(feed_id: feed.id).size
    user_feed = UserFeed.create feed_id: feed.id, unread: count
    user_feed.save
  end

end

