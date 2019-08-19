//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

const homeStartingContent = "This is some dummy Home content";
const aboutContent = "This is some dummy About content";
const contactContent = "This is some dummy Contact content";

// let posts = [];
let map = new Map();
let postMap = new Map();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home", {homeContent: homeStartingContent, postMap: postMap});
  //console.log(posts);
  console.log(map);
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
  //console.log(req.body);
  let post = {
    title: req.body.postTitle.trimEnd(),
    body: req.body.postContent
  };

  //console.log("post title: " + post.title);
  //console.log("post content: " + post.body);

  if(req.body.postTitle && req.body.postContent){
    // posts.push(post);
    // will be using this map so we can delete a post alot faster
    postMap.set(post.title, post.body);
    // since the titles are not large enough, this will perform very well
    let title = post.title.toLowerCase().split(" ").join("-");
    map.set(title, {body: post.body, orgTitle: post.title});
    res.redirect("/posts/"+title);
  } else {
    res.send("Post not submitted! Missing the title or the body.");
  }
});

app.get("/posts/:postTitle", function(req, res){
  console.log(req.params.postTitle);

  let key = req.params.postTitle.toLowerCase();
  if(map.get(key)){
    // let index = map.get(req.params.postTitle.toLowerCase()).index;
    console.log("match found");
    res.render("post", {postTitle: map.get(key).orgTitle, postContent: map.get(key).body});
  } else {
    res.send("This post does not exist!");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
