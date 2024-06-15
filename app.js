if(process.env.NODE_ENV != "production"){
    require('dotenv').config() ;
}
console.log(process.env.SECRET) ;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL ;
const MongoStore = require("connect-mongo")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport") ;
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js") ;
const userRouter = require("./routes/user.js") ;

const store = MongoStore.create({
    mongoUrl : dbUrl ,
    crypto : {
        secret : process.env.SECRET ,
    },
    touchAfter : 24 * 3600 ,
})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err) ;
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true,
    }
};

// will comee before routess
app.use(session(sessionOptions));
app.use(flash()) ;

//passport wala code k liye session hona chaye 
app.use(passport.initialize());
// every request to know to which session it belons to
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())) ;

// to store & remove info of user in a sesion
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next() ;
})

app.get("/demouser",async(req,res)=>{
    let fakeuser = new User({
        email : "abc@gmail.com",
        username : "delta-student"
    });
   let registeredUser = await User.register(fakeuser,"hello!");
   res.send(registeredUser) ;
})




main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.redirect("/listings");
})



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter) ;


// if no matching response found above
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { err });
//     // res.status(statusCode).send(message);
//     // res.send("something went wrong ") ;
// });
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    if (statusCode === 500) {
        res.status(statusCode).render("error.ejs", { err });
    } else {
        res.status(404).render("error.ejs", { err });
    }
});

app.listen(8080, () => {
    console.log("server is listening to port 8080")
})


// working...website pr /listing krke access krenge kya ??