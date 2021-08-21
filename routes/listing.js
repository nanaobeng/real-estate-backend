const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addListing} = require('../controllers/listing');
const { isAuth } = require("../controllers/auth");


router.post("/admin/listing/add", authorize,addListing);


module.exports = router;