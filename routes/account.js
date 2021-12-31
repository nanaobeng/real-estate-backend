const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {addAdmin,deleteAdmin,getAdmins} = require('../controllers/account');
//authorizeentication

router.post("/admin/add", authorize,addAdmin);


router.delete("/admin/delete/:id",authorize,deleteAdmin);
router.get('/administrators',getAdmins);
module.exports = router;