const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");


const { isAuth } = require("../controllers/auth");
const { insertUser } = require("../controllers/subscription");


router.post("/subscription/add",insertUser);



module.exports = router;