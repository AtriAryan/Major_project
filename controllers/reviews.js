const Listing = require("../models/listing");
const Review = require("../models/review");



module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // from form after Submit
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review added!")
    // console.log("new review saved") ;
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // from form after Submit
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review added!")
    // console.log("new review saved") ;
    res.redirect(`/listings/${listing._id}`);
}