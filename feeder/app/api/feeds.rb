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

      end
    end
  end