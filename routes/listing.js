const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addListing,getListing,deleteListing, getListings, listingBySeach} = require('../controllers/listing');
const { isAuth } = require("../controllers/auth");


router.post("/admin/listing/add", authorize,addListing);
router.get("/listing/:id",getListing);
router.get("/listings",getListings);
router.delete("/admin/listing/:id",authorize,deleteListing);
router.post("/listings/by/search", listingBySeach);


module.exports = router;