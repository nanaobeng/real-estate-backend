const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

const {register, login ,isAuth, deleteAccount,signout} = require('../controllers/auth');
//authorizeentication

router.post("/register", validInfo,register,authorize);

router.post("/login", validInfo, login);
router.post("/verify", authorize, isAuth)
router.delete("/admin/account/delete/:id",deleteAccount);
router.get('/signout',  signout );
module.exports = router;