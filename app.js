//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lowerCase = require('lodash.lowercase');
const mysql = require("mysql");
const date = require('date-and-time');




const homeStartingContent = "This is a page for posting personal blog posts. Go to /compose path to write a poast.";
const aboutContent = "My name is Tony. I created this page with a html/css front end and mysql back end. It is hosted on heroku and uses heroku's cloud based sql, clearDB.";
const contactContent = "Phone number, email.";

const app = express();


const db = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b5d10ea4b7c234",
  password: "d56d690a",
  database: "heroku_e0af44fdfb12f8a"
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected.")
  }
})
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


app.get("/", function (req, res) {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, retrievedPosts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: retrievedPosts
      });
    }
  });


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

app.get("/posts/:postTitle", function (req, res) {
  const sql = `SELECT * FROM posts WHERE title = '${req.params.postTitle}'`;
  let query = db.query(sql, (err,result)=>{
    if(err){
      console.log(err);
    } else {
      res.render("post", {
        postTitle: result[0].title,
        postBody: result[0].body
      });
    }
  })
});

app.post("/compose", function (req, res) {
  const timeCreated = new Date();
  const dateString = date.format(timeCreated, 'MMM DD YYYY HH:mm:ss');
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody,
    date_created: dateString
  };
  const sql = 'INSERT INTO posts SET ?'
  db.query(sql, post, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("post has been added to mysql");

      res.redirect("/");
    }
  });


});


const server = app.listen(process.env.PORT || 3000, ()=> {
  console.log("Server started.");
});
