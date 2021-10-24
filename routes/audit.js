const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");


const { isAuth } = require("../controllers/auth");
const { insertRecord ,getRecords, countRecords} = require("../controllers/audit");


router.post("/admin/audit/log",authorize,insertRecord);
router.get("/admin/audit/logs/", authorize,getRecords);
router.get("/admin/audit/log/count", authorize,countRecords);


module.exports = router;