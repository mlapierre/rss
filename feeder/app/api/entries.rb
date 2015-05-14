module Entries
  class API < Grape::API
    
    version 'v1', using: :header, vendor: 'mdlap'
    format :json

    resource :entries do

      # desc "Return all entries"
      # get do
      #   Entry.all.take(10)
      # end

      desc "Return an entry"
      params do
        requires :id, type: Integer, desc: "Entry id."
      end
      route_param :id do
        get do
          Entry.find(params[:id])
        end
      end

      desc "Return unread entries for a feed"
      params do
        requires :feed_id, type: Integer, desc: "Feed id."
      end
      get 'feed/:feed_id' do
        Entry.where(feed_id: params[:feed_id]).take(10)
      end

      desc "Update an entry"
      params do
        optional :title, type: String, desc: "The entry\'s title"
        optional :url, type: String, desc: "The entry\'s url"
        optional :author, type: String, desc: "The entry\'s author"
        optional :content, type: String, desc: "The entry\'s content"
        optional :summary, type: String
        optional :image, type: String
        optional :published, type: DateTime
        optional :read_at, type: DateTime
        optional :feed_id, type: Integer
      end
      put ':id' do
        supplied_params = declared(params, include_missing: false)
        supplied_params[:updated] = Time.current
        permitted_params = ActionController::Parameters.new(supplied_params).permit(:url, 
                                                                                    :title, 
                                                                                    :author, 
                                                                                    :content, 
                                                                                    :summary, 
                                                                                    :image,
                                                                                    :published,
                                                                                    :updated,
                                                                                    :feed_id,
                                                                                    :read_at)      
        Entry.find(params[:id]).update(permitted_params)
      end

    end
  end
end
