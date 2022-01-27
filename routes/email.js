const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const { testEmail } = require('../controllers/email');
const { isAuth } = require("../controllers/auth");


router.post("/email", testEmail);



module.exports = router;