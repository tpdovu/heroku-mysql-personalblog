//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const date = require('date-and-time');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "heroku_e0af44fdfb12f8a"
});


//#region setup content 
const homeStartingContent = "This is a page for posting personal blog posts. Click on 'personal blog' to go to /compose and write post. Most recent posts are listed at the top.";
const aboutContent = "My name is Tony. I created this page with a html/css front end and mysql back end. It is hosted on heroku and uses heroku's cloud based sql, clearDB.";
const contactContent = "Phone number, email.";

const app = express();



app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//#endregion
app.get("/", function (req, res) {
  const sql = 'SELECT * FROM posts';
  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query(sql, (err, retrievedPosts) => {
      if (err) {
        throw err;
      }
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: retrievedPosts
      });
      connection.release();
    });
  });
});

app.get("/posts/:postTitle/id/:postID", function (req, res) {
  const sql = `SELECT * FROM posts WHERE id = '${req.params.postID}'`;
  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("post", {
        postTitle: result[0].title,
        postBody: result[0].body
      });

      connection.release();
    });
  });
});

app.post("/compose", function (req, res) {
  const timeCreated = new Date();
  const dateString = date.format(timeCreated, 'MMM DD YYYY');
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody,
    date_created: dateString
  };
  const sql = 'INSERT INTO posts SET ?'
  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query(sql, post, (err, result) => {
      if (err) {
        throw err;
      }
      connection.release();
      res.redirect("/");
    })
  })
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server started.");
});