package models

import (
  "github.com/jinzhu/gorm"
    _ "github.com/lib/pq"
  "os"
  "log"
)

type DB interface {
  Connect()
  InitSchema()
  GetFeed(id string) (Feed, error)
}

type GormDB struct {
  db gorm.DB
}

func (g *GormDB) Connect() {
  var err error
  g.db, err = gorm.Open("postgres", "user=rss dbname=rss_dev sslmode=disable host=" + os.Getenv("PGDB_1_PORT_5432_TCP_ADDR"))
  if err != nil {
    log.Fatalf("Got error when connect database, the error is '%v'", err)
  }
  g.db.LogMode(true)
}

func (g *GormDB) InitSchema() {
  g.db.AutoMigrate(&Feed{}, &Tag{}, &User{}, &UserFeed{}, &UserFeedTag{})
}

func (g *GormDB) GetFeed(id string) (feed Feed, err error) {
  err := g.db.First(&feed, id).Error
  return
}