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


exports.insertUser =  async (req,res) => {
    try {
        
        const { email} = req.body.values;
        

        const newRecord = await pool.query(
          "INSERT INTO subscription_list(email) VALUES($1) RETURNING *",
          [email]
        );
    
        res.json(newRecord.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};

