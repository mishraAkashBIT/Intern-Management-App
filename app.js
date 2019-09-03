var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Employee = require("./models/employee");
var seedDB = require("./seeds");

app.use(bodyParser.urlencoded({ extended: true })); //memorised code.. [:) ]
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/security-app-v4"); //connect it to mongodb with a dynamic db called
//seedDB();

//ROUTES 1
app.get("/", function(req, res) {
  res.render("landings");
});
//ROUTES 2
app.get("/employees", function(req, res) {
  //get campgrounds from database
  Employee.find({}, function(err, allemployees) {
    if (err) {
      console.log(err);
    } else {
      res.render("employees", { employees: allemployees });
    }
  });
});

app.post("/employees", function(req, res) {
  //add new campground location fetched from forms
  // res.send("post rout hit");
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newEmployee = { name: name, image: image, description: desc };
  //campgrounds.push(newCampGround);aadd it to database
  Employee.create(newEmployee, function(err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      //   redirect to campgrounds ro
      res.redirect("/employees");
    }
  });
  //
});

//

app.get("/employees/new", function(req, res) {
  res.render("new");
});

app.get("/employees/:id", function(req, res) {
  Employee.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundEmployee) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { employee: foundEmployee });
      }
    });
  // res.send("hello");
});

app.get("/employees/:id/new-comment", function(req, res) {
  Employee.findById(req.params.id, function(err, foundEmployee) {
    if (err) {
      console.log(err);
    } else {
      res.render("new-comment", { employee: foundEmployee });
    }
  });
});

//posting new comments
app.post("/employee/:id", function(req, res) {
  var author = req.body.author;
  var comment = req.body.comment;
  var newComment = { author: author, comment: comment };
  Comment.create(newComment, function(err, newcomment) {
    if (err) {
      console.log(err);
    } else {
      Employee.findById(req.params.id, function(err, foundEmployee) {
        if (err) {
          console.log(err);
        } else {
          res.render("new-comment", { employee: foundEmployee });
        }
      });

     
    }
  });
});

//listening
app.listen(3000, function() {
  console.log("YELP CAMP SERVER STARTED on port 3000.");
});
