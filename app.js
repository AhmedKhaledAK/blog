//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const github = require(__dirname+"/secret/github.js");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/akblogdb", {useNewUrlParser: true});

const app = express();

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "This is some dummy Home content";

let map = new Map();
let postMap = new Map();
let repos = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  postMap.clear();
  Post.find(function(err, posts){
    posts.forEach(function(post){
      postMap.set(post.postTitle, post.postContent);
    });
    res.render("home", {homeContent: homeStartingContent, postMap: postMap});
  });
});

app.get("/home", function(req, res){
  res.redirect("/");
});

app.get("/github", function(req, res){

  let options = {
    url: "https://api.github.com/users/AhmedKhaledAK/repos",
    method: "GET",
    headers: {
      "User-Agent": github.getUser(),
    },
    auth: {
      "user": github.getUser(),
      "pass": github.getPassword()
    }
  };

  request(options, function(error, response, body){
    repos = [];
    let dataObject = JSON.parse(body);
    for(var i = 0; i < dataObject.length; i++){
      let repoObject = {
        name: dataObject[i].name,
        description: dataObject[i].description,
        html_url: dataObject[i].html_url
      };
      repos.push(repoObject);
    }
    res.render("github", {repos: repos});

  });

});

app.get("/resume", function(req, res){
  res.render("resume");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  let post = {
    title: req.body.postTitle.trimEnd(),
    body: req.body.postContent
  };

  if(req.body.postTitle && req.body.postContent){
    postMap.set(post.title, post.body);
    const postInDB = new Post({
      postTitle: post.title,
      postContent: post.body
    });
    postInDB.save();

    res.redirect("/posts/"+post.title);
  } else {
    res.send("Post not submitted! Missing the title or the body.");
  }
});

app.get("/posts/:postTitle", function(req, res){
  console.log(req.params.postTitle);

  let key = req.params.postTitle.trimEnd();
  if(postMap.get(key)){
    console.log("match found");
    res.render("post", {postTitle: key, postContent: postMap.get(key)});
  } else {
    res.send("This post does not exist!");
  }
});

app.get("/email", function(req, res){
  res.send("Send an email to: ahmedkhaledabab@gmail.com");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
