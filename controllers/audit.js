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


exports.insertRecord =  async (req,res) => {
    try {
        
        const { activity,user_id} = req.body.values;
        

        const newRecord = await pool.query(
          "INSERT INTO audit_logs(activity,user_id) VALUES($1,$2) RETURNING *",
          [activity,parseInt(user_id)]
        );
    
        res.json(newRecord.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};

exports.countRecords =  async (req,res) => {
  try {
     
    const select = await pool.query("SELECT COUNT(*) FROM audit_logs ")

   
  

    res.json(select.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};


exports.getRecords =  async (req,res) => {
  try {
     
    const select = await pool.query("SELECT * FROM audit_logs ")

   
  

    res.json(select.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};


