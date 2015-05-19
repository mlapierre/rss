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
              feed_tags.to_json
            end
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