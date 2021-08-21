const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");


exports.addLocation =  async (req,res) => {
    try {
        const { city,region,country,coordinates } = req.body;
        const newLocation = await pool.query(
          "INSERT INTO locations (city,region,country,coordinates) VALUES($1,$2,$3,$4) RETURNING *",
          [city,region,country,coordinates]
        );
    
        res.json(newLocation.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};