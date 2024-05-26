const express = require("express");
const app = express();
const users = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");


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

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    console.log(req.session.name);
    // res.send(name);
    res.redirect("/hello") ;
})
app.get("/hello", (req, res) => {
    res.send(`hello, ${ req.session.name }`);
})

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

// app.get("/test",(req,res)=>{
// res.send("test successful!")
// })


app.listen(3000, () => {
    console.log("server connected to port 3000");
});