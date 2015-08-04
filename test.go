package main

import (
    "database/sql"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
    //"encoding/json"
    "log"
    "code.google.com/p/go.crypto/bcrypt"
  )

type Project struct {
    Id          uint64
    Title       string
    Enddate     string
    Author      string
    Description string
    Category    string
    Address     string
    Goal        string
    Funded      string
    Backers     uint64
    Days_to_go  int64
    Img_sm      string
    Img_l       string
}

type User struct {
    Id           uint64
    Name         string
    Email        string
    Phone        string
    Introduction string
    Img_avatar   string
}

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
        c.Header("Content-type", "text/html")
        c.File("./html/index.html")
        //c.HTML(200, "index.html", nil);
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

    r.GET("/projects", GetProjects)
    r.GET("/project/:id", GetProject)

    r.GET("/user/:id", GetUser)

    r.Run(":8080") // listen and serve on 0.0.0.0:8080
}

func PostLogin(c *gin.Context) {
    var id string
    var pass string

    var db = SetupDB()

    email, password := c.PostForm("email"), c.PostForm("password")

    err := db.QueryRow("select id, password from users where email=$1", email).Scan(&id, &pass)
    if err != nil || bcrypt.CompareHashAndPassword([]byte(pass), []byte(password)) != nil {
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

    c.String(200, "Registration Successful")
    //c.Redirect(302, "/")
}

func GetProjects(c *gin.Context) {
    var db = SetupDB()

    rows, err := db.Query("SELECT id, title, author, description, category, address, " +
                          "goal, funded, backers, days_to_go, img_sm FROM projects " +
                          "LIMIT 100")

    if err != nil {
        log.Fatal(err)
    }

    var projects []Project
    for rows.Next() {
        project := Project{}
        if err := rows.Scan(&project.Id, &project.Title, &project.Author, 
                            &project.Description, &project.Category, 
                            &project.Address, &project.Goal, &project.Funded, 
                            &project.Backers, &project.Days_to_go, 
                            &project.Img_sm); err != nil {
            log.Fatal(err)
        }
        projects = append(projects, project)
    }

    c.JSON(200, projects)
}

func GetProject(c *gin.Context) {
    id := c.Param("id")
    var db = SetupDB()

    row := db.QueryRow("SELECT id, title, author, description, category, address, " +
                       "goal, funded, backers, days_to_go, img_l FROM projects " +
                       "WHERE id=$1", id)

    project := Project{}
    if err := row.Scan(&project.Id, &project.Title, &project.Author, 
                       &project.Description, &project.Category, 
                       &project.Address, &project.Goal, &project.Funded, 
                       &project.Backers, &project.Days_to_go, 
                       &project.Img_l); err != nil {
        log.Fatal(err)
    }

    c.JSON(200, project)
}

func GetUser(c *gin.Context) {
    id := c.Param("id")
    var db = SetupDB()

    row := db.QueryRow("SELECT id, name, email, phone, img_avatar, introduction " +
                       "FROM users WHERE id=$1", id)

    user := User{}
    if err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Phone,
                       &user.Img_avatar, &user.Introduction); err != nil {
        log.Fatal(err)
    }

    c.JSON(200, user)
}
