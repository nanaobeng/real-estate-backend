const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addLocation} = require('../controllers/location');
const { isAuth } = require("../controllers/auth");


router.post("/admin/location/add", isAuth,addLocation);

module.exports = router;