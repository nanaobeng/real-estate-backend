const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");



exports.addListing =  async (req,res) => {
    try {
        const { listing_title,thumbnail,description,property_type,
            rooms,has_parking,avaiable_for_sale,avaiable_for_rent,
            sale_price,location_id
        
        
        } = req.body;
        const select = await pool.query("SELECT * FROM listing WHERE listing_title = $1", [
            listing_title
          ])

          if (select.rows.length > 0) {
            return res.status(401).json(`${listing_title} already exists`);
          }

        const newLocation = await pool.query(
          "INSERT INTO listing (listing_title,thumbnail,description,property_type,rooms,has_parking,avaiable_for_sale,avaiable_for_rent,sale_price,location_id) VALUES($1,$2,$3,$4) RETURNING *",
          [listing_title,thumbnail,description,property_type,
            rooms,has_parking,avaiable_for_sale,avaiable_for_rent,
            sale_price,location_id]
        );
    
        res.json(newLocation.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};
