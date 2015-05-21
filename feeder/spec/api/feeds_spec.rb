require 'rails_helper'

describe Feeds::API do 

  describe "PATCH /feeds/:feed_id/:tag_name_or_id" do
    it "Can tag a feed by tag id" do
      patch "/feeds/1/", tag_name_or_id: 19
      feed_tag = JSON.parse(response.body)
      tag = Tag.find_by_id feed_tag["tag_id"]

      expect(response.status).to eq 200
      expect(tag.name).to eql 'foo'
    end
  end

  describe "GET /feeds/tags" do
    it "Returns all feeds and their tags" do
      #feed_tags = FeedsHelper.getTagsAndFeeds
      get "/feeds/tags"
      byebug
    end
  end

end