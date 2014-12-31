module Entries
  class API < Grape::API
    
    version 'v1', using: :header, vendor: 'mdlap'
    format :json

    resource :entries do

      desc "Return an entry"
      params do
        requires :id, type: Integer, desc: "Entry id."
      end
      route_param :id do
        get do
          Entry.find(params[:id])
        end
      end

    end
  end
end
