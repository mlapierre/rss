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

        # POST /feeds/:feed_id/tags
        desc "Add a feed tag"
        params do
          requires :feed_id, type: Integer, desc: "Feed id"
          requires :name, type: String, desc: "The new tag"
        end
        post do
          tag = TagsHelper.add(params[:name])
          if !tag.nil?
            { status: 'created', tag: tag.to_json }
          else
            error!({ error: "Tag already exists"}, 409)
          end
        end

      end
    end
  end