const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");



exports.addListing =  async (req,res) => {
    try {
        const { city,region,country,coordinates } = req.body;
        const select = await pool.query("SELECT * FROM listing WHERE city = $1", [
            city
          ])

          if (select.rows.length > 0) {
            return res.status(401).json(`${city} already exists`);
          }

        const newLocation = await pool.query(
          "INSERT INTO locations (city,region,country,coordinates) VALUES($1,$2,$3,$4) RETURNING *",
          [city,region,country,coordinates]
        );
    
        res.json(newLocation.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};
