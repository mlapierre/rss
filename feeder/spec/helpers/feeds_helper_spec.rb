require 'rails_helper'
require 'opml-parser'

include OpmlParser
# Specs in this file have access to a helper object that includes
# the FeedsHelper. For example:
#
# describe FeedsHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
RSpec.describe FeedsHelper, :type => :helper do
  context "import opml" do
    let (:opml_xml) { <<-END.gsub(/^\s+/, '')
      <?xml version="1.0" encoding="UTF-8"?>
      <opml version="1.0">
        <head>
          <title>Test subscriptions</title>
        </head>
        <body>
          <outline text="science" title="science">
            <outline text="AnandTech" title="AnandTech" type="rss" xmlUrl="http://anandtech.com/rss" htmlUrl="http://www.anandtech.com/"/>
            <outline text="Freakonomics" title="Freakonomics" type="rss" xmlUrl="http://freakonomics.com/blog/feed/" htmlUrl="http://freakonomics.com/"/>
          </outline>
          <outline text="tech" title="tech">
            <outline text="Chromium Blog" title="Chromium Blog" type="rss" xmlUrl="http://blog.chromium.org/feeds/posts/default" htmlUrl="http://blog.chromium.org/"/>
          </outline>
        </body>
      </opml>
      END
    }

    let (:opml) { 
      [ OpmlParser::Outline.new({
          text:    "science",
          title:   "science"}),
        OpmlParser::Outline.new({
          text:    "AnandTech",
          title:   "AnandTech",
          type:    "rss",
          xmlUrl:  "http://anandtech.com/rss",
          htmlUrl: "http://www.anandtech.com/"}),
        OpmlParser::Outline.new({
          text:    "Freakonomics",
          title:   "Freakonomics",
          type:    "rss",
          xmlUrl:  "http://freakonomics.com/blog/feed/",
          htmlUrl: "http://freakonomics.com/"}),
        OpmlParser::Outline.new({
          text:    "tech",
          title:   "tech"}),
        OpmlParser::Outline.new({
          text:    "Chromium Blog",
          title:   "Chromium Blog",
          type:    "rss",
          xmlUrl:  "http://blog.chromium.org/feeds/posts/default",
          htmlUrl: "http://blog.chromium.org/" }),
      ]
    }

    it "adds new feeds from an opml file" do
      output = FeedsHelper.import_opml(opml_xml)
      0.upto(output.length-1) do |i|
        expect(opml[i].attributes).to eq output[i].attributes
      end
    end

    it "parses an opml file into an OpmlParser object" do
      expect(FeedsHelper).to receive(:import_opml).with(opml_xml)

      filename = "spec/fixtures/test_opml.xml"
      FeedsHelper.import_opml_from(filename)
    end

  end

end
