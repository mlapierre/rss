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
          feed_tags = FeedsHelper.getTagsAndFeeds
          if !feed_tags.nil?
            feed_tags_json = []
            feed_tags.each do |tag|
              tag_json = JSON.parse(tag.to_json)
              if !tag.user_feed_tags.empty?
                feeds = []
                tag.user_feed_tags.each do |feed_tag|
                  feed = JSON.parse(feed_tag.feed.to_json)
                  feed["order"] = feed_tag.order
                  feeds.append feed
                end
                tag_json["feeds"] = feeds
              else
                tag_json["feeds"] = [];
              end
              feed_tags_json.append(tag_json)
            end  
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