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
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY

})

require("dotenv").config();
exports.addListing =  async (req,res) => {
    try {
        console.log(process.env.AKIAZUG3G6F7YWX5YIRY)
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
            let l_id = ''
            let image = ''



            const select = await pool.query("SELECT * FROM listing WHERE listing_title = $1", [
                        listing_title
                      ])
            
                      if (select.rows.length > 0) {
                        return res.status(401).json(`${listing_title} already exists`);
                      }
            

        //insert listing

        const newLocation = await pool.query(
                  "INSERT INTO listing (listing_title,thumbnail,description,property_type,rooms,has_parking,available_for_sale,available_for_rent,sale_price,location_id,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
                  [listing_title,'test thumb' ,description,property_type,
                    rooms,has_parking,available_for_sale,available_for_rent,
                    sale_price,location_id,'pending']
                );
            
                res.json(newLocation.rows[0]);
                l_id = newLocation.rows[0].listing_id
             


            for(var i = 0; i<files.image.length ; i++){
                    
        let fileName = files.image[i].path
        console.log(fileName)

            
        // Read content from the file
        const fileContent = fs.readFileSync(fileName);
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: 'swiftwebapp',
            Key: files.image[i].name, // File name you want to save as in S3
            Body: fileContent
        };

        
    
        // Uploading files to the bucket
        s3.upload(params, async function(err, data) {
          try{
            if (err) {
                throw err;
            }

            console.log(`File uploaded successfully. ${data.Location}`);
            
            // uploading to postgress
            const newImage = await pool.query(
                      "INSERT INTO images(listing_id,url) VALUES($1,$2) RETURNING *",
                      [l_id,(data.Location)]
                    );

                    res.json(newImage.rows[0]);      
        
            }
            catch (err) {
                console.error(err.message);
                return;
               } 
        });
            }
            
        }
      

    })
}
catch (err) {
       console.error(err.message);
      }


    
    


};


exports.getListing =  async (req,res) => {
    try {
        console.log(process.env.AWS_ACCESS_KEY)
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM listing WHERE listing_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`listing does not exist!`);
      }
      const newList = await pool.query("SELECT * FROM listing WHERE listing_id = $1", [
        id
      ]);
  
      res.json(newList.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };

  exports.getListings =  async (req,res) => {
    try {
       
      const select = await pool.query("SELECT * FROM listing ")

     
    
  
      res.json(select.rows);
    } catch (err) {
      console.error(err.message);
    }
  };



  
  exports.deleteListing =  async (req,res) => {
    try {
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM listing WHERE listing_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`Listing does not exist!`);
      }
      const deleteListing = await pool.query("DELETE FROM listing WHERE listing_id = $1", [
        id
      ]);
      res.json("Listing was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  };


  exports.listingBySeach =  async (req,res) => {
    
    let order = 'DESC';
    let sortBy =  'listing_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 6;
 
    let location = req.body.filters.location ? parseInt(req.body.filters.location) : false;
    let property_type = req.body.filters.property_type ? req.body.filters.property_type : false;
    let purchase_type = req.body.filters.purchase_type ? req.body.filters.purchase_type : 'sale_price';
    let price_min = req.body.filters.price_min ? parseInt(req.body.filters.price_min) : 0;
    let price_max = req.body.filters.price_max ? parseInt(req.body.filters.price_max) : 3500;
    let rooms = req.body.filters.rooms ? parseInt(req.body.filters.rooms) : 5;

    let query = 'SELECT * FROM listing WHERE ';
    if(purchase_type){
        if(purchase_type == "sale_price"){
            query = query + `${purchase_type} BETWEEN ${price_min} AND ${price_max} AND  available_for_sale `
        }
        else{
            query = query + `${purchase_type} BETWEEN ${price_min} AND ${price_max} AND  available_for_rent  `
        }
       
    }

    if(property_type){
        query = query + ` AND property_type = '${property_type}'  `
    }

    if(rooms){
        query = query + ` AND rooms = ${rooms} `
    }

    if(location){
        query = query + ` AND location_id = ${location} `
    }

    query = query + `ORDER BY ${sortBy} ${order}`
    query = query + ` LIMIT ${limit}`
    
    console.log(query)
    const select = await pool.query(query)
    res.json(select.rows);



  };

  exports.listingRequest =  async (req,res) => {
    try {
        
        const { listing_id,firstname,lastname,title,email,phone } = req.body.values;
        

        const newRequests = await pool.query(
          "INSERT INTO listing_requests (listing_id,firstname,lastname,title,email,phone,status,client_type) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
          [parseInt(listing_id),firstname,lastname,title,email,phone,"pending","client"]
        );
    
        res.json(newRequests.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};


exports.clientRequest =  async (req,res) => {
    try {
        
        const { firstname,lastname,title,email,phone,sale_price,rent_price,isRent,isSale,comment,rooms,property_type,location} = req.body.values;
        

        const newClientRequest = await pool.query(
          "INSERT INTO client_requests (firstname,lastname,title,email,phone,available_for_sale,available_for_rent,sale_price,rent_price,client_message,bedrooms,property_type,status,property_location) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
          [firstname,lastname,title,email,phone,isSale,isRent,sale_price,rent_price,comment,rooms,property_type,'pending',location]
        );
    
        res.json(newClientRequest.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};
