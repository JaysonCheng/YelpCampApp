var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

// Requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// APP CONFIG
// DATABASE CONFIG
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to MongoDB!");
}).catch(err => {
	console.log("ERRPR", err.message);
});

// mongoose.connect("mongodb+srv://JaysonCheng98:Googleintern98@cluster0-wjnue.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true
// }).then(() => {
// 	console.log("Connected to MongoDB!");
// }).catch(err => {
// 	console.log("ERRPR", err.message);
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Seed the Database
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "I love corgis",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YELP CAMP IS BOOTING UP!");
});