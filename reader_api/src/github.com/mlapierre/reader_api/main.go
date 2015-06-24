package main

import (
  "github.com/mlapierre/reader_api/models"
  "github.com/mlapierre/reader_api/controllers"
  "github.com/ant0ine/go-json-rest/rest"
  "log"
  "net/http"
)

func main() {
  db := models.GormDB{}
  rAdapt := controllers.RestAdapterImplementation{}

  api := rest.NewApi()
  api.Use(rest.DefaultDevStack...)
  api.Use(&rest.CorsMiddleware{
    RejectNonCorsRequests: false,
    OriginValidator: func(origin string, request *rest.Request) bool {
      //return origin == "http://my.other.host"
      return true
    },
    AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowedHeaders: []string{
      "Accept", "Content-Type", "X-Custom-Header", "Origin"},
    AccessControlAllowCredentials: true,
    AccessControlMaxAge:           3600,
  })
  router, err := rAdapt.Init(&db)
  if err != nil {
    log.Fatal(err)
  }
  api.SetApp(router)
  log.Fatal(http.ListenAndServe(":3001", api.MakeHandler()))
}
