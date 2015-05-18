  module Tags
    class API < Grape::API

      version 'v1', using: :header, vendor: 'mdlap'
      format :json

      resource :tags do

        # POST /tags
        desc "Add a feed tag"
        params do
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