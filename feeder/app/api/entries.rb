module Entries
  class API < Grape::API
    
    version 'v1', using: :header, vendor: 'mdlap'
    format :json

    resource :entries do

      # GET entries/:id
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
        optional :after, type: String, default: nil
      end
      get 'feed/:feed_id' do
        last_updated = UserEntry.group(:entry_id).maximum(:updated_at)
        is_read = UserEntry.select(:entry_id).where(entry_id: last_updated.keys, updated_at: last_updated.values).where.not(read_at: nil)
        query = Entry.where.not(id: is_read)
                     .where(feed_id: params[:feed_id])
        if params[:after] != nil
          if params[:order] == "asc" && params[:sort_by] == "published"
            query = query.where("entries.published > ?", DateTime.parse(params[:after]))
          elsif params[:order] == "desc" && params[:sort_by] == "published"
            query = query.where("entries.published < ?", DateTime.parse(params[:after]))
          elsif params[:order] == "asc" && params[:sort_by] == "id"
            query = query.where("entries.id > ?", params[:after]) 
          elsif params[:order] == "desc" && params[:sort_by] == "id"
            query = query.where("entries.id < ?", params[:after]) 
          end
        end
        query = query.order(params[:sort_by].to_sym => params[:order].to_sym)
                     .take(params[:n])
      end

      # POST entries/read/:entry_id
      desc "Mark an entry read"
      params do
        requires :entry_id, type: Integer
        requires :read_at, type: DateTime
      end
      post 'read/:entry_id' do
        user_entry = UserEntry.new
        user_entry.entry_id = params[:entry_id]
        user_entry.read_at = params[:read_at]
        user_entry.updated_at = DateTime.now
        user_entry.save
      end

      # PUT entries/:id
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
        permitted_entry_params = ActionController::Parameters.new(supplied_params).permit(:url, 
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
