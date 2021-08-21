const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');



exports.addListing =  async (req,res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        else{
         
            const { listing_title,description,property_type,
                rooms,has_parking,available_for_sale,available_for_rent,
                 sale_price,location_id
             
             
            } = fields;
            console.log(files.image)
        }
      

    })

    
    // try {
    //     const { listing_title,thumbnail,description,property_type,
    //         rooms,has_parking,available_for_sale,available_for_rent,
    //         sale_price,location_id
        
        
    //     } = fields;
    //     const select = await pool.query("SELECT * FROM listing WHERE listing_title = $1", [
    //         listing_title
    //       ])

    //       if (select.rows.length > 0) {
    //         return res.status(401).json(`${listing_title} already exists`);
    //       }

    //       const checkLocation = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
    //         location_id
    //       ])

    //       if (checkLocation.rows.length < 0) {
    //         return res.status(401).json(`Requested Location does not exist`);
    //       }

    //     const newLocation = await pool.query(
    //       "INSERT INTO listing (listing_title,thumbnail,description,property_type,rooms,has_parking,available_for_sale,available_for_rent,sale_price,location_id,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
    //       [listing_title,thumbnail,description,property_type,
    //         rooms,has_parking,available_for_sale,available_for_rent,
    //         sale_price,location_id,'pending']
    //     );
    
    //     res.json(newLocation.rows[0]);
    //   } catch (err) {
    //     console.error(err.message);
    //   }


};
