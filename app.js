//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

const homeStartingContent = "This is some dummy Home content";
const aboutContent = "This is some dummy About content";
const contactContent = "This is some dummy Contact content";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home", {homeContent: homeStartingContent});
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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
