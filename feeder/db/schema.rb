# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150629183020) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "article_tags", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entries", force: true do |t|
    t.text     "title"
    t.text     "url"
    t.text     "author"
    t.text     "content"
    t.text     "summary"
    t.text     "image"
    t.datetime "updated"
    t.datetime "published"
    t.integer  "feed_id"
  end

  add_index "entries", ["feed_id"], name: "index_entries_on_feed_id", using: :btree

  create_table "feeds", force: true do |t|
    t.text     "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "updated"
    t.text     "subtitle"
    t.text     "icon"
    t.text     "description"
    t.text     "feed_link"
    t.text     "source_link"
  end

  create_table "pages", force: true do |t|
    t.integer  "entry_id"
    t.text     "url"
    t.text     "title"
    t.text     "content"
    t.datetime "retrieved_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["entry_id"], name: "index_pages_on_entry_id", using: :btree

  create_table "tags", force: true do |t|
    t.string  "name"
    t.integer "order"
  end

  create_table "user_article_tags", force: true do |t|
    t.integer  "entry_id"
    t.integer  "article_tag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_article_tags", ["article_tag_id"], name: "index_user_article_tags_on_article_tag_id", using: :btree
  add_index "user_article_tags", ["entry_id"], name: "index_user_article_tags_on_entry_id", using: :btree

  create_table "user_entries", force: true do |t|
    t.datetime "read_at"
    t.integer  "entry_id"
    t.datetime "updated_at"
  end

  add_index "user_entries", ["entry_id"], name: "index_user_entries_on_entry_id", using: :btree

  create_table "user_entry_events", force: true do |t|
    t.integer  "entry_id_id"
    t.integer  "user_event_id_id"
    t.datetime "occurred_at"
  end

  add_index "user_entry_events", ["entry_id_id"], name: "index_user_entry_events_on_entry_id_id", using: :btree
  add_index "user_entry_events", ["user_event_id_id"], name: "index_user_entry_events_on_user_event_id_id", using: :btree

  create_table "user_events", force: true do |t|
    t.string "event_name"
  end

  create_table "user_feed_tags", force: true do |t|
    t.integer "feed_id"
    t.integer "tag_id"
    t.integer "order"
  end

  add_index "user_feed_tags", ["feed_id"], name: "index_user_feed_tags_on_feed_id", using: :btree
  add_index "user_feed_tags", ["tag_id"], name: "index_user_feed_tags_on_tag_id", using: :btree

  create_table "user_feeds", force: true do |t|
    t.integer "feed_id_id"
    t.integer "unread"
    t.integer "sort_order"
  end

  add_index "user_feeds", ["feed_id_id"], name: "index_user_feeds_on_feed_id_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "pass_hash"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
