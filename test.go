package main

import (
    "database/sql"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
  )

func SetupDB() *sql.DB {
    db, err := sql.Open("postgres", "dbname=btckapital1 sslmode=disable")
    PanicIf(err)
    return db
}

func PanicIf(err error) {
  if err != nil {
    panic(err)
  }
}


func main() {
    r := gin.Default()
    /* HTML */
    r.LoadHTMLGlob("html/*.html")

    /* Assets */
    r.Static("/assets", "./html/assets")

    /* Router */
    r.GET("/", func(c *gin.Context) {
        c.HTML(200, "index.html", nil);
    })
    r.GET("/index-search.html", func(c *gin.Context) {
        c.HTML(200, "index-search.html", nil);
    })
    r.GET("/index-map.html", func(c *gin.Context) {
        c.HTML(200, "index-map.html", nil);
    })
    r.GET("/index-map-fullscreen.html", func(c *gin.Context) {
        c.HTML(200, "index-map-fullscreen.html", nil);
    })

    /* API */
    r.POST("/login", PostLogin)

    r.Run(":8080") // listen and serve on 0.0.0.0:8080
}

func PostLogin(c *gin.Context) {
    var id string

    var db = SetupDB()

    email, password := c.PostForm("email"), c.PostForm("password")
    err := db.QueryRow("select id from users where email=$1 and password=$2", email, password).Scan(&id)
    if err != nil {
      c.String(401, "Not Authorized")
    }

    c.String(200, "User id is " + id)
}
