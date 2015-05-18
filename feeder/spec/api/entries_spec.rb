require 'rails_helper'

describe Entries::API do 
  describe "GET /entries/:id" do
    it "returns a status by id" do
      get "/entries/100"
      expect(response.status).to eq 200
    end
  end

  describe "PUT /entries/:id" do
    it "Updates the changed field" do
      id = 100
      entry = Entry.find(id)
      put "/entries/#{id}", title: 'Test'
      entry.reload
      expect(response.status).to eq 200
      expect(entry.title).to eql 'Test'
      expect(entry.updated.between? Time.current-5.seconds, Time.current).to be
    end

    it "Updates a new entry" do
      entry = Entry.create!
      put "/entries/#{entry.id}", title: 'Test'
      entry.reload
      expect(response.status).to eq 200
      expect(entry.title).to eql 'Test'
      expect(entry.updated.between? Time.current-5.seconds, Time.current).to be
    end
  end
end