const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addLocation,updateLocation} = require('../controllers/location');
const { isAuth } = require("../controllers/auth");


router.post("/admin/location/add", authorize,addLocation);
router.put("/admin/location/update/:id", authorize,updateLocation);

module.exports = router;