const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing")
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer") ;
const {storage} = require("../cloudConfig.js")
// save uploads in storage
const upload = multer({storage}) ;
router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validatelisting,
        wrapAsync(listingController.createListing));


// //index route
// router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

// Create route
router.post('/',
    validatelisting,
    isLoggedIn,
    wrapAsync(listingController.createListing))

// Edit route
router.get("/:id/edit", isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validatelisting, 
    wrapAsync(listingController.updateListing)
);

//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

module.exports = router;
