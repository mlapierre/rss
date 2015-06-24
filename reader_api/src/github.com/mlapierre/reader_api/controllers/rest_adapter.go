package controllers

import (
  "github.com/ant0ine/go-json-rest/rest"
  "github.com/mlapierre/reader_api/models"
)

type RestAdapter interface {
  Init() (router rest.App, err error)
  GetFeed(w rest.ResponseWriter, r *rest.Request)
  GetAllFeeds(w rest.ResponseWriter, r *rest.Request)
  GetAllTags(w rest.ResponseWriter, r *rest.Request)
}

type RestAdapterImplementation struct {
  db models.DB
}

func (a *RestAdapterImplementation) Init(db models.DB) (router rest.App, err error) {
  a.db = db

  router, err = rest.MakeRouter(
    rest.Get("/feeds/:id", a.GetFeed),
    rest.Get("/feeds", a.GetAllFeeds),
    rest.Get("/tags", a.GetAllTags),
  )
  return
}

// GET /feeds/:id
// Returns a feed
func (a *RestAdapterImplementation) GetFeed(w rest.ResponseWriter, r *rest.Request) {
  id := r.PathParam("id")
  feed, err := a.db.GetFeed(id)
  if err != nil {
    rest.NotFound(w, r)
    return
  }
  w.WriteJson(&feed)
}

// GET /feeds
// Returns all feeds and their tags
func (a *RestAdapterImplementation) GetAllFeeds(w rest.ResponseWriter, r *rest.Request) {
// func (i *Impl) GetAllFeeds(w rest.ResponseWriter, r *rest.Request) {
//   feeds := []Feed{}
//   i.DB.Find(&feeds)
//   for index, feed := range feeds {
//     i.DB.Model(&feed).Association("Tags").Find(&feeds[index].Tags)
//   }
//   w.WriteJson(&feeds)
// }

}

// GET /tags
// Returns all tags and their feeds
func (a *RestAdapterImplementation) GetAllTags(w rest.ResponseWriter, r *rest.Request) {
// func (i *Impl) GetAllTags(w rest.ResponseWriter, r *rest.Request) {
//   tags := []UserFeedTag{}

//   rows, err := i.DB.Raw(`
//     SELECT f.id, f.title, uf.sort_order, uf.unread, t.id, t.name, uft.sort_order
//       FROM feeds f
// LEFT OUTER JOIN user_feeds uf ON f.id = uf.feed_id
// LEFT OUTER JOIN users u on u.id = uf.user_id
// LEFT OUTER JOIN user_feed_tags uft on uft.feed_id = uf.feed_id
// LEFT OUTER JOIN tags t on t.id = uft.tag_id`).Rows()
//   if err != nil {
//     log.Fatalf("Error: '%v'", err)
//   }
//   defer rows.Close()
//   for rows.Next() {
//     var title, name string
//     var feed_id, feed_order, unread, tag_id, tag_order int
//     rows.Scan(&feed_id, &title, &feed_order, &unread, &tag_id, &name, &tag_order)

//     fmt.Println(title + " - " + name)
//   }

//   w.WriteJson(&tags)
// }
}
