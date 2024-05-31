const express = require("express");
const app = express();
const users = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware cookie parser
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie(" name", "India", { signed: true });
//     res.send("signed cookoe sent");
// })
// app.get("/verify", (req, res) => {
//     // only unsigned cookies 
//     // console.log(req.cookies);

//     // for signed cookies
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// // middleware body cookie-parser
// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("hi, i am root");
// })

// //user 
// app.use("/user", users);
// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     res.send(`hi, ${name}`)
// })

// app.get("/getCookies", (req, res) => {
//     // name - value pair...
//     res.cookie("greet", "Namaste_!");
//     res.cookie("Made_in", "Bharat");
//     res.send("cookies set");
// });

const sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    //  console.log(req.session.name);
    if (name === "anonymous") {
        req.flash("error", "please enter your name");
    } else {
        req.flash("success", "user registered successfully!");
    }
    res.redirect("/hello");
})
// flash msg come on screen only once 
app.get("/hello", (req, res) => {
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", { name: req.session.name });
});

//session will be treated is same on the same browser inspite of alag alag tags
// session is stored in temporary memory
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`you sent a request ${req.session.count} times`);
})
// like if i  run without this below route but when i uncomment this route it should work but it does not
// did u see?

app.get("/test",(req,res)=>{
console.log("this is a test route !")
.send("test successful!")
})


app.listen(3000, () => {
    console.log("server connected to port 3000");
});