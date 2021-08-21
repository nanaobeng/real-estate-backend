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
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


exports.addListing =  async (req,res) => {
    try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true
    form.parse(req, async (err, fields, files) => {
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
            const l_id = ''

        //insert listing

        const newLocation = await pool.query(
                  "INSERT INTO listing (listing_title,thumbnail,description,property_type,rooms,has_parking,available_for_sale,available_for_rent,sale_price,location_id,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
                  [listing_title,'test thumb' ,description,property_type,
                    rooms,has_parking,available_for_sale,available_for_rent,
                    sale_price,location_id,'pending']
                );
            
                res.json(newLocation.rows[0]);
                console.log(newLocation.rows[0].listing_id)


        //     for(var i = 0; i<files.image.length ; i++){
                    
        // let fileName = files.image.path

            
        // // Read content from the file
        // const fileContent = fs.readFileSync(fileName);
    
        // // Setting up S3 upload parameters
        // const params = {
        //     Bucket: 'swifthomes',
        //     Key: files.photo.name, // File name you want to save as in S3
        //     Body: fileContent
        // };

        
    
        // // Uploading files to the bucket
        // s3.upload(params, function(err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`File uploaded successfully. ${data.Location}`);
            
        //     // uploading to postgress
        //     const newImage = await pool.query(
        //               "INSERT INTO images(listing_id,url) VALUES($1,$2) RETURNING *",
        //               [listing_id,(data.location)]
        //             );
            
        // });
        //     }
        }
      

    })
}
catch (err) {
       console.error(err.message);
      }


    
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
