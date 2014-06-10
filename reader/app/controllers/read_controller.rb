class ReadController < ApplicationController
  def index
    feed = Feed.new
    feed.url = 'http://www.theverge.com/rss/frontpage'
    feed.title = 'The Verge'
    feed.description = 'The Verge feed'
    @temp = feed.url
  end
end
