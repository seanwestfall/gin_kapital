package main

import (
    "database/sql"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
    "code.google.com/p/go.crypto/bcrypt"
  )

func SetupDB() *sql.DB {
    db, err := sql.Open("postgres", "user=**** dbname=**** password=**** port=5432 sslmode=disable")
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
    r.Static("/app", "./html/admin/app")
    r.Static("/server", "./html/admin/server")

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

    r.GET("/admin", func(c *gin.Context) {
        c.Header("Content-type", "text/html")
        c.File("./html/admin/index-admin.html")
    })

    /* API */
    r.POST("/login", PostLogin)
    r.GET("/logout", GetLogout)
    r.POST("/signup", PostSignup)

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

    c.String(200, "Authorized")
}

func GetLogout(c *gin.Context) {
    c.String(200, "Session Closed")
}

func PostSignup(c *gin.Context) {
    name, email, password := c.PostForm("name"), c.PostForm("email"), c.PostForm("password")
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    PanicIf(err)

    var db = SetupDB()
    _, err = db.Exec("insert into users (name, email, password) values ($1, $2, $3)", name, email, hashedPassword)
    PanicIf(err)

    c.Redirect(302, "/")
}
