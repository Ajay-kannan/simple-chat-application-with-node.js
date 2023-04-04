// App.js

var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose"),
	path = require("path");
var app = express();

const User = require("./model/user");
const client = require('socket.io-client');
const server = require("http").Server(app);

const io = require('socket.io')(server);

// router
const userRoute = require("./routes/users");

// app.use("/chat",userRoute);

mongoose.connect("mongodb://127.0.0.1:27017/login");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));
app.use('/views', express.static("public"));
// app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



io.on("connection",socket => {
	socket.on("friendname", friend => {
		console.log(friend);
	});
    socket.on("message" , msg =>{
		socket.broadcast.emit("revmessage" ,msg);
	});
	
})

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
app.get("/chat", isLoggedIn, function (req, res) {
	res.render("chat");
});


// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup
app.post("/register", async (req, res) => {
	var user = await User.create({
	username: req.body.username,
	password: req.body.password
	});
	
	return res.status(200).json(user);
});
//Showing login form
app.get("/login", function (req, res) {

	res.render("login")
	// res.sendFile(path.join(__dirname+'/chat.html'));
	
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		username = req.body.username;
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("chat",{user});
		}
		else {
			res.status(400).json({ error: "password doesn't match" });
		}
		}
		else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	}
	catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout
app.get("/logout", function (req, res) {
	
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next() ;
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log("Server Has Started!");
});
