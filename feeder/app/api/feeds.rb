  module Feeds
    class API < Grape::API

      version 'v1', using: :header, vendor: 'mdlap'
      format :json

      resource :feeds do

        # GET /feeds
        # GET /feeds.json
        desc "Return all feeds"
        get do
          Feed.all
        end

        # GET /feeds/tags
        desc "Return all feeds and their tags"
        get "tags" do
          # Get records of read entries
          last_updated = UserEntry.group(:entry_id).maximum(:updated_at)
          is_read = UserEntry.select(:entry_id).where(entry_id: last_updated.keys, updated_at: last_updated.values).where.not(read_at: nil)

          # Get all tags
          feed_tags = FeedsHelper.getTagsAndFeeds
          if !feed_tags.nil?
            feed_tags_json = []
            # For each tag, add all tagged feeds to the response object
            feed_tags.each do |tag|
              tag_json = JSON.parse(tag.to_json)
              if !tag.user_feed_tags.empty?
                feeds = []
                tag.user_feed_tags.each do |feed_tag|
                  feed = JSON.parse(feed_tag.feed.to_json)
                  # Get unread count
                  # TODO Make this more efficient
                  count = Entry.where.not(id: is_read).where(feed_id: feed["id"]).size
                  feed["unread_count"] = count
                  feed["order"] = feed_tag.order
                  feeds.append feed
                end
                tag_json["feeds"] = feeds
              else
                tag_json["feeds"] = [];
              end
              feed_tags_json.append(tag_json)
            end 
            # Add untagged feeds
            feeds = FeedsHelper.getUntaggedFeeds
            feeds_json = JSON.parse(feeds.to_json)
            feeds_json.each do |feed|
              feed["unread_count"] = Entry.where.not(id: is_read).where(feed_id: feed["id"]).size
            end
            tag = {
                    "id":-1, 
                    "name":"untagged", 
                    "order":9999999,
                    "feeds": feeds_json
                  }
            feed_tags_json.append(tag)
            JSON.parse(feed_tags_json.to_json)
          end
        end

        # GET /feeds/tags/:id
        desc "Return a tag and its feeds"
        params do
          requires :id, type: Integer, desc: "Feed id."
        end
        get "tags/:id" do
          UserFeedTag.find_by_id params[:id]
        end

        # PATCH /feeds/tags
        desc "Update all feeds and their tags"
        params do
          requires :tags, type: Array do
            requires :feeds, type: Array
          end
        end
        patch "tags" do
          data_tags = params[:tags]
          data_tags.each do |data_tag|
            tag = Tag.find_by_id data_tag[:id]
            if !tag.nil?
              tag.order = data_tag[:order]
              tag.save
              if !data_tag.feeds.empty?
                data_tag[:feeds].each do |data_feed|
                  user_feed_tag = UserFeedTag.find_by feed_id: data_feed[:id]
                  user_feed_tag.order = data_feed[:order]
                  user_feed_tag.tag_id = data_tag[:id]
                  user_feed_tag.save
                end
              end
            end
          end
          { status: 'success' }
        end

        # GET /feeds/:id
        desc "Return a feed"
        params do
          requires :id, type: Integer, desc: "Feed id."
        end
        route_param :id do
          get do
            Feed.find(params[:id])
          end
        end

        # POST /feeds
        desc "Add a feed"
        params do
          requires :link, type: String, desc: "The URL of the feed to add"
        end
        post do
          feed = FeedsHelper.add(params[:link])
          if !feed.nil?
            { status: 'created', feed: feed.to_json }
          else
            error!({ error: "Feed already exists"}, 409)
          end
        end

        # PATCH /feeds/:feed_id
        desc "Add a feed tag"
        params do
          requires :feed_id, type: Integer, desc: "Feed id"
          requires :tag_name_or_id, type: String, desc: "The tag name or id"
        end
        patch ':feed_id' do
          tag = FeedsHelper.tagFeed(params[:feed_id], params[:tag_name_or_id])
          # if !tag.nil?
          #   tag
          # end
        end

      end
    end
  end