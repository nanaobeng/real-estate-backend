const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addListing,getListing,deleteListing, getListings, listingBySeach, clientRequest, listingRequest, countListing, getClientRequest, increaseListingCount, getListingViews, countFilteredListing, getClientRequests,getListRequest, changeListingStatus, getListingImages, test, getFourListings, deleteListingImage, updateListing, getAllClientRequests,changeClientRequestStatus} = require('../controllers/listing');
const { isAuth } = require("../controllers/auth");


router.post("/admin/listing/add", authorize,addListing);
router.get("/listing/:id",getListing);
router.get("/admin/client/listing/:id",getClientRequest);
router.get("/listings",getListings);
router.get("/listings/count",countListing);
router.delete("/admin/listing/:id",authorize,deleteListing);
router.put("/admin/listing/update/:id",authorize,updateListing);
router.delete("/admin/listing/image/:id",authorize,deleteListingImage);
router.post("/listings/by/search", listingBySeach);
router.post("/listing/availability", listingRequest);
router.post("/listing/client/request", clientRequest);
router.post("/listings/increment/:id", increaseListingCount);
router.get("/listings/chart",getListingViews);
router.get("/test",test);
router.get("/listings/client/requests",getAllClientRequests);
router.post("/listings/by/filtered/search", countFilteredListing);
router.get("/listings/request",getClientRequests);
router.get("/listing/request/:id",getListRequest);
router.post("/listings/status/:id", changeListingStatus);
router.get("/listing/images/:id",getListingImages);
router.get("/listings/home",getFourListings);
router.post("/listings/client/requests/status/:id", changeClientRequestStatus);







module.exports = router;