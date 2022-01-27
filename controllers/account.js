const express = require("express");
const formidable = require('formidable');
const _ = require('lodash');
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");
require("dotenv").config();


exports.addAdmin =  async (req,res) => {
    
    const { email, password,firstname,lastname } = req.body;
 

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
      [firstname,lastname, email, bcryptPassword,'active','testlink']
    );

    
    console.log('success')
    return res.json({ success: 'Administrator Account Created' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
 

};

exports.deleteAdmin =  async (req,res) => {
    try {
        console.log('dsds')
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM administrators WHERE user_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`User does not exist!`);
      }
      const deleteLocation = await pool.query("DELETE FROM administrators WHERE user_id = $1", [
        id
      ]);
      res.json("Account Successfuly Deleted!");
    } catch (err) {
      console.log(err.message);
    }
  };

  exports.getAdmins =  async (req,res) => {
    try {
    
    console.log(req.params)
      const { email} = req.params;
      
      const todo = await pool.query(`SELECT * FROM administrators  `);
  
      res.json(todo.rows);
    } catch (err) {
      console.error(err.message);
    }
  };






