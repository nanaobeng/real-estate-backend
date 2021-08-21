const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addLocation,updateLocation,getLocation,deleteLocation} = require('../controllers/location');
const { isAuth } = require("../controllers/auth");


router.post("/admin/location/add", authorize,addLocation);
router.put("/admin/location/update/:id", authorize,updateLocation);
router.get("/location/:id",getLocation);
router.delete("/admin/location/:id",authorize,deleteLocation);

module.exports = router;