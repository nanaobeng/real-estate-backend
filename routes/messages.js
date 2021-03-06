const express = require("express");
const router = express.Router();

const pool = require("../db");

const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");


const { isAuth } = require("../controllers/auth");
const { clientMessage,getMessages,getMessage, changeMessageStatus } = require("../controllers/message");


router.post("/client/message",clientMessage);
router.post("/admin/messages/", authorize,getMessages);
router.get("/admin/message/:id", authorize,getMessage);
router.post("/admin/message/status/:id", changeMessageStatus);


module.exports = router;