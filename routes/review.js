const express = require("express") ;
//_id ko app.js k bahar bi use krne k liye mergeparams true kiya h 
const router = express.Router({mergeParams :true}) ;
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js") ;
const Listing = require("../models/listing.js")



const validateReview= (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
     throw new ExpressError(400,errMsg)
    }
    else next() ;
};

// Reviews
// pass validreview as a middleware
router.post("/",validateReview, wrapAsync(async(req,res)=>{
let listing = await Listing.findById(req.params.id) ;
// from form after Submit
let newReview = new Review(req.body.review) ;

listing.reviews.push(newReview) ;

await newReview.save() ;
await listing.save() ;

// console.log("new review saved") ;
res.redirect(`/listings/${listing._id}`) ;
})); 

//delete Reviews
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params ;
// to update listing reviews array as we need to remove that review fromthere also 
// we use pull operator that removes value which matches
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId) ;
    res.redirect(`/listings/${id}`) ;
}))

module.exports = router;