const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const { countNewMessages, countClientRequests, countListingRequests, dashboardCount } = require('../controllers/dashboard');
const { isAuth } = require("../controllers/auth");



router.get("/messages/new/count",countNewMessages);
router.get("/client/listings/new/count",countClientRequests);
router.get("/listing/requests/new/count",countListingRequests);
router.get("/admin/dashboard/counts",dashboardCount);









module.exports = router;