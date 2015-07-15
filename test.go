package main

import (
    "github.com/gin-gonic/gin"
  )

func main() {
    r := gin.Default()
    r.LoadHTMLGlob("html/*.html")
    r.Static("/assets", "./html/assets")
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
    r.Run(":8080") // listen and serve on 0.0.0.0:8080
}

