  module Pages
    class API < Grape::API

      version 'v1', using: :header, vendor: 'mdlap'
      format :json

      resource :pages do

        desc "Return a page"
        params do
          requires :id, type: Integer, desc: "Page id."
        end
        route_param :id do
          get do
            Page.find(params[:id])
          end
        end

      end
    end
  end
