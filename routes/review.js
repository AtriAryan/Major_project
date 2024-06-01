const express = require("express") ;
//_id ko app.js k bahar bi use krne k liye mergeparams true kiya h 
const router = express.Router({mergeParams :true}) ;
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js") ;
const Listing = require("../models/listing.js")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")



// Reviews
// pass validreview as a middleware
router.post("/",
isLoggedIn ,
validateReview, wrapAsync(reviewController.createReview)); 

//delete Reviews
router.delete("/:reviewId",
isLoggedIn ,
isReviewAuthor ,
wrapAsync(reviewController.destroyReview))

module.exports = router;