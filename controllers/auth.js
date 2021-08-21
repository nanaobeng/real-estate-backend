const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

exports.register =  async (req,res) => {
    const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM administrators WHERE email = $1", [
      email
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
  
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO administrators (firstname, lastname,email, passcode,status,resetlink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      ['rudy','dadey', email, bcryptPassword,'inactive','testlink']
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

};