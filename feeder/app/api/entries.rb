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

      # GET entries/feed/:feed_id?n=:n&sortBy=:sort_by&order=:order&after=:after
      desc "Return unread entries for a feed"
      params do
        requires :feed_id, type: Integer, desc: "Feed id."
        optional :n, type: Integer, default: 10, desc: "Number of entries to return"
        optional :sort_by, type: String, default: "published"
        optional :order, type: String, default: "desc"
        optional :after, type: DateTime, default: nil
      end
      get 'feed/:feed_id' do
        query = Entry.includes(:user_entries)
                     .where(user_entries: {read_at: nil})
                     .where(feed_id: params[:feed_id])
        if params[:after] != nil
          if params[:order] == "asc"
            query = query.where("published > ?", params[:after]) 
          else
            query = query.where("published < ?", params[:after]) 
          end
        end
        query = query.order(params[:sort_by].to_sym => params[:order].to_sym)
                     .take(params[:n])
      end
      #Entry.where("? < ?", "published", DateTime.parse("2015-01-01")).order(published: :desc).take(5)

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
