package models

import (
  "time"
)

type User struct {
  Id int
  Name string
  Email string
}

type Feed struct {
  Id          int       `json:"id"`
  Title       string    `sql:"size:1024" json:"title"`
  Subtitle    string    `sql:"size:1024" json:"subtitle"`
  Icon        string    `sql:"size:1024" json:"icon"`
  Description string    `sql:"size:1024" json:"description"`
  FeedLink    string    `sql:"size:1024" json:"feed_link"`
  SourceLink  string    `sql:"size:1024" json:"source_link"`
  CreatedAt   time.Time `json:"created_at"`
  UpdatedAt   time.Time `json:"updated_at"`
}

type Tag struct {
  Id    int    `json:"id"`
  Name  string `json:"name"`
}

type UserFeed struct {
  UserId int `sql:"index"`
  FeedId int `sql:"index"`
  SortOrder int
  Unread int
}

type UserFeedTag struct {
  UserId int `sql:"index"`
  FeedId int `json:"feed_id" sql:"index"`
  TagId  int `json:"tag_id" sql:"index"`
  SortOrder  int `json:"order"`

  UserFeeds []UserFeed `gorm:"many2many:user_feed_tags;"` // Many-To-Many
}
