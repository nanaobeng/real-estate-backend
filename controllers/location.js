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
        const select = await pool.query("SELECT * FROM locations WHERE city = $1", [
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

exports.updateLocation =  async (req,res) => {
    try {
      const { id } = req.params;
      const { city,region,country,coordinates } = req.body;
      const date = ''
      const updateLocation = await pool.query(
        "UPDATE locations SET city = $2 ,region = $3,country = $4,coordinates = $5 WHERE location_id = $1",
        [id,city,region,country,coordinates]
      );
  
      res.json("Location was updated!");
      
    } catch (err) {
      console.error(err.message);
    }
  }