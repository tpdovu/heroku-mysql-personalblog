//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lowerCase = require('lodash.lowercase');
const mysql = require("mysql");



const homeStartingContent = "home Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "about Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "contact Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();



// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "mydb"
// });

const db = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b5d10ea4b7c234",
  password: "d56d690a",
  database: "heroku_e0af44fdfb12f8a"
});

//mysql://b5d10ea4b7c234:d56d690a@us-cdbr-east-04.cleardb.com/heroku_e0af44fdfb12f8a?reconnect=true
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected.")
  }
})
app.set('view engine', 'ejs');

//create DB
// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE blahblah";
//   db.query(sql, (err, result) => {
//     if(err){
//       console.log(err);
//     } else {
//       console.log(result);
//       res.send("Database created...");
//     }
//   });
// });

//create table
// app.get('/createpoststable', (res, req) => {
//   let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
//   db.query(sql, (err, result)=> {
//     if(err){
//       console.log(err);
//     } else {
//       console.log(result);
//       res.send('Posts table created....');

//     }
//   });
// });

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


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started.");
});