require 'rails_helper'

describe Tags::API do 

  describe "POST /tags" do
    it "Adds a new tag" do
      post "/tags", name: 'foo'
      res = JSON.parse(response.body)
      tag = JSON.parse(res["tag"])
      expect(response.status).to eq 201
      expect(tag["name"]).to eql 'foo'
    end

    it "Does not allow duplicate tags" do
      post "/tags", name: 'foo'
      post "/tags", name: 'foo'
      expect(response.status).to eq 409
    end
  end

end