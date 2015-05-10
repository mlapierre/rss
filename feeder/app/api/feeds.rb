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

        # "Add a feed"
        # "Delete a feed"

      end
    end
  end