const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js") ;
main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi, i am root !");
})

// validating listing at backend
const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new ExpressError(400,errMsg)
    }
    else next() ;
}
const validateReview= (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new ExpressError(400,errMsg)
    }
    else next() ;
}
//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));
// Create route
app.post('/listings',
validatelisting,
wrapAsync(async (req, res, next) => {
    // let { title,description,image,price,country,location} = req.body ;  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}))
// Edit route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
// update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Reviews
// pass validreview as a middleware
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
let listing = await Listing.findById(req.params.id) ;
// from form after Submit
let newReview = new Review(req.body.review) ;

listing.reviews.push(newReview) ;

await newReview.save() ;
await listing.save() ;

// console.log("new review saved") ;
res.redirect(`/listings/${listing._id}`) ;
})); 


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : " My new Villa",
//         description : "by  the beach" ,
//         price : 1200 ,
//         location :" Calanguta,goa" ,
//         country : "India",
//     });
//    await  sampleListing.save() ;
//    console.log("sample was saved")
//    res.send("successful testing") ;
// })

// if no matching response found above
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{err}) ;
    // res.status(statusCode).send(message);
    // res.send("something went wrong ") ;
});

app.listen(8080, () => {
    console.log("server is listening to port 8080")
})