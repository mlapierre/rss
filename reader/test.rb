#require 'feedjira'
require 'simple-rss'
require 'open-uri'
require 'pry'

# # fetching multiple feeds
# feed_urls = ["http://feeds.feedburner.com/PaulDixExplainsNothing", "http://feeds.feedburner.com/trottercashion"]

# feeds = Feedzirra::Feed.fetch_and_parse(feeds_urls)
# binding.pry
# # feeds is now a hash with the feed_urls as keys and the parsed feed objects as values. If an error was thrown
# # there will be a Fixnum of the http response code instead of a feed object

# # updating multiple feeds. it expects a collection of feed objects
# updated_feeds = Feedzirra::Feed.update(feeds.values)

rss = SimpleRSS.parse open('http://slashdot.org/index.rdf')

p rss.channel.title # => "Slashdot"
p rss.channel.link # => "http://slashdot.org/"
p rss.items.first.link # => "http://books.slashdot.org/article.pl?sid=05/08/29/1319236&amp;from=rss"