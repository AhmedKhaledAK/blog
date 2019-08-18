//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

const homeStartingContent = "This is some dummy Home content";
const aboutContent = "This is some dummy About content";
const contactContent = "This is some dummy Contact content";

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home", {homeContent: homeStartingContent});
  console.log(posts);
});

app.get("/home", function(req, res){
  res.redirect("/");
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  console.log(req.body);
  let post = {
    title: req.body.postTitle,
    body: req.body.postContent
  };

  //console.log("post title: " + post.title);
  //console.log("post content: " + post.body);

  if(req.body.postTitle && req.body.postContent){
    posts.push(post);
  } else {
    res.send("Post not submitted! Missing the title or the body.");
  }
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
