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
require("dotenv").config();




exports.addListing =  async (req,res) => {
    try {
    let thumbnail_image = ''
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
         
            const { listing_title,description,property_type,purchase_type,
                rooms,has_parking,has_gym,has_pool,is_furnished,off_plan,
                 price,location_id,bathrooms,images,imageCount
             
             
            } = fields;
            let l_id = ''
            
            console.log(files.images)
          
        
           

            const select = await pool.query("SELECT * FROM listing WHERE listing_title = $1", [
                        listing_title
                      ])
            
                      if (select.rows.length > 0) {
                        return res.status(401).json({error:`${listing_title} already exists`});
                      }

                    
                      let fileName = files.thumbnail.path
       

            
                      // Read content from the file
                      const fileContent = fs.readFileSync(fileName);
                  
                      // Setting up S3 upload parameters
                      const params = {
                          Bucket: 'swiftimages',
                          Key: files.thumbnail.name, // File name you want to save as in S3
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
                          // console.log(`listing_title : ${} , thumbnail : ${} , description property_type,rooms,bathrooms,has_parking,price,location_id,status,purchase_type,has_gym,has_pool,offplan,is_furnished`)
                          const newLocation = await pool.query(
                            "INSERT INTO listing (listing_title,thumbnail,description,property_type,rooms,bathrooms,has_parking,price,location_id,status,purchase_type,has_gym,has_pool,offplan,is_furnished) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *",
                            [listing_title,data.Location,description,property_type,rooms,bathrooms,(has_parking === 'true' || has_parking === 1 || has_parking === "1" ? 1 : 0),price,location_id,'inactive',purchase_type,(has_gym === 'true' || has_gym === 1 || has_gym === "1" ? 1 : 0),(has_pool === 'true' || has_pool === 1 || has_pool === "1" ? 1 : 0),(off_plan === 'true' || off_plan === 1 || off_plan === "1" ? 1 : 0),(is_furnished === 'true' || is_furnished === 1 || is_furnished === "1" ? 1 : 0)]
                          );
                      
                          res.json(newLocation.rows[0]);
                          console.log('dsds')
                          console.log(newLocation.rows[0])

                          l_id = newLocation.rows[0].listing_id
                          console.log(newLocation.rows[0].listing_id)


                         
        for(var i = 0; i<files.images.length; i++){
      
          let fileName = files.images[i].path

       
    

         
     // Read content from the files
     const fileContent = fs.readFileSync(fileName);
 
     // Setting up S3 upload parameters
     const params = {
         Bucket: 'swiftimages',
         Key: files.images[i].name, // File name you want to save as in S3
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
                          catch (err) {
                              console.error(err.message);
                              return;
                             } 
                      });
            
            
            

        
        
       
 
  
            
        }
      

    })
}
catch (err) {
       console.error(err.message);
      }


    
    


};


exports.getListing =  async (req,res) => {
    try {
       
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
      query = `SELECT * FROM listing WHERE listing_id = ${req.params.id}`
      delete_query = `DELETE FROM listing WHERE listing_id = ${req.params.id}` 
      console.log(query)
      const select = await pool.query(query)

      if (select.rows.length === 0) {
        return res.status(401).json({error:`Listing does not exist!`});
      }
      
      const deleteListing = await pool.query(delete_query);
      res.json("Listing was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  };


  exports.listingBySeach =  async (req,res) => {
    
    let order = 'DESC';
    let sortBy =  'listing_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 6;

    let has_parking = req.body.filters.has_parking ? parseInt(req.body.filters.has_parking) : 0;
    let has_gym = req.body.filters.has_gym ? parseInt(req.body.filters.has_gym) : 0;
    let has_pool = req.body.filters.has_pool ? parseInt(req.body.filters.has_pool) : 0;
    let off_plan = req.body.filters.off_plan ? parseInt(req.body.filters.off_plan) : 0;
    console.log(off_plan)
    let is_furnished = req.body.is_furnished ? parseInt(req.body.is_furnished) : 0;
 
    let location = req.body.filters.location ? parseInt(req.body.filters.location) : false;
    let property_type = req.body.filters.property_type ? req.body.filters.property_type : false;
    let purchase_type = req.body.filters.purchase_type ? req.body.filters.purchase_type : 'sale';
    let price_min = req.body.filters.price_min ? parseInt(req.body.filters.price_min) : 0;
    let price_max = req.body.filters.price_max ? parseInt(req.body.filters.price_max) : 3500;
    let rooms = req.body.filters.rooms ? parseInt(req.body.filters.rooms) : 0;

    let query = 'SELECT * FROM listing WHERE ';
    if(purchase_type){
     
            query = query + `price BETWEEN ${price_min} AND ${price_max} AND purchase_type = '${purchase_type}' `
        
      
       
    }

    if(property_type){
        query = query + ` AND property_type = '${property_type}'  `
    }

    if(off_plan == 1){
      query = query + ` AND offplan  `
  }

  if(has_parking == 1){
    query = query + ` AND has_parking  `
}

if(has_pool == 1){
  query = query + ` AND has_pool  `
}

if(has_gym == 1){
  query = query + ` AND has_gym  `
}

if(is_furnished == 1){
  query = query + ` AND is_furnished  `
}

    if(rooms != 0){
      
        query = query + ` AND rooms = ${rooms} `
    }

    if(rooms == 5){
      
      query = query + ` AND rooms > 4 `
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
        
        const { fullname,listing_id,firstname,lastname,title,email,phone } = req.body.values;
       

        const newRequests = await pool.query(
          "INSERT INTO listing_requests (fullname,listing_id,firstname,lastname,title,email,phone,status,client_type) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
          [fullname,parseInt(listing_id),firstname,lastname,title,email,phone,"pending","client"]
        );
    
        res.json(newRequests.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};




exports.getClientRequest =  async (req,res) => {
  try {
     
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM client_requests WHERE cid = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Request does not exist!`);
    }
    const newList = await pool.query("SELECT * FROM client_requests WHERE cid = $1", [
      id
    ]);

    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};


exports.countListing =  async (req,res) => {
    try {
       
      const select = await pool.query("SELECT COUNT(*) FROM listing ")

     
    
  
      res.json(select.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };



  exports.increaseListingCount =  async (req,res) => {
 
    try {
    
      const { id } = req.params;
      console.log(req.body.title)
      console.log(req.body.location)
      let title = req.body.title 
      let location = req.body.location 

      const current_date = ((new Date()).getMonth() + 1) +'/'+ ((new Date()).getFullYear())

     
      
      const select = await pool.query("SELECT * FROM listing_views WHERE listing_id = $1 AND period = $2", [
        parseInt(id),current_date
      ])

  
      if (select.rows.length === 0) {
        const newRow = await pool.query("INSERT INTO listing_views (listing_id,period,view_count,city,title) VALUES($1,$2,$3,$4,$5) RETURNING *", [
          parseInt(id),current_date,1,location,title
        ])

        res.json(newRow.rows[0]);
      }
      else{
        const increment = select.rows[0].view_count + 1
       
        const updateRow = await pool.query("UPDATE listing_views SET view_count = $1 , city = $2 , title = $3 WHERE listing_id = $4 AND period = $5" ,[increment,location,title,parseInt(id),current_date])

        res.json({"success":"Listing was updated"});
      }
  
      
    } catch (err) {
      console.error(err.message);
    }

  
};


exports.getListingViews =  async (req,res) => {
  try {
    const current_date = ((new Date()).getMonth() + 1) +'/'+ ((new Date()).getFullYear())
    console.log('select')
    const select = await pool.query(`SELECT * FROM listing_views`)
    // const select = await pool.query(`SELECT listing_id , view_count FROM listing_views WHERE period = $1 ORDER BY view_count ASC LIMIT 5 ` ,[current_date ])

    console.log(select)
   
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.countFilteredListing =  async (req,res) => {
  try {
     


    let has_parking = req.body.filters.has_parking ? parseInt(req.body.filters.has_parking) : 0;
    let has_gym = req.body.filters.has_gym ? parseInt(req.body.filters.has_gym) : 0;
    let has_pool = req.body.filters.has_pool ? parseInt(req.body.filters.has_pool) : 0;
    let off_plan = req.body.filters.off_plan ? parseInt(req.body.filters.off_plan) : 0;
    console.log(off_plan)
    let is_furnished = req.body.is_furnished ? parseInt(req.body.is_furnished) : 6;
 
    let location = req.body.filters.location ? parseInt(req.body.filters.location) : false;
    let property_type = req.body.filters.property_type ? req.body.filters.property_type : false;
    let purchase_type = req.body.filters.purchase_type ? req.body.filters.purchase_type : 'sale';
    let price_min = req.body.filters.price_min ? parseInt(req.body.filters.price_min) : 0;
    let price_max = req.body.filters.price_max ? parseInt(req.body.filters.price_max) : 3500;
    let rooms = req.body.filters.rooms ? parseInt(req.body.filters.rooms) : 5;

    let query = 'SELECT * FROM listing WHERE ';
    if(purchase_type){
 
            query = query + `price BETWEEN ${price_min} AND ${price_max} AND 
            purchase_type =  '${purchase_type}' `
        
       
       
    }

    if(property_type){
        query = query + ` AND property_type = '${property_type}'  `
    }

    if(off_plan == 1){
      query = query + ` AND offplan  `
  }

  if(has_parking == 1){
    query = query + ` AND has_parking  `
}

if(has_pool == 1){
  query = query + ` AND has_pool  `
}

if(has_gym == 1){
  query = query + ` AND has_gym  `
}

if(is_furnished == 1){
  query = query + ` AND is_furnished  `
}

    if(rooms != 0){
      
        query = query + ` AND rooms = ${rooms} `
    }

    if(location){
        query = query + ` AND location_id = ${location} `
    }
    console.log('here')
    console.log(query)
    const select = await pool.query(query)
    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.getClientRequests =  async (req,res) => {
  try {
    
    const select = await pool.query("SELECT * FROM listing_requests")

  
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getListRequest =  async (req,res) => {
  try {
     
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM listing_requests WHERE r_id = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Request does not exist!`);
    }
    const newList = await pool.query("SELECT * FROM listing_requests WHERE r_id = $1", [
      id
    ]);

    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};

exports.changeListingStatus =  async (req,res) => {
 
  try {
  
    const { id } = req.params;

   
    
    
    

     
      const updateRow = await pool.query("UPDATE listing_requests SET status = $1 WHERE r_id = $2 " ,['read',id])

      res.json({"success":"Listing Request was updated"});
   
    
  } catch (err) {
    console.error(err.message);
  }


};


exports.getListingImages =  async (req,res) => {
  try {
     
    const { id } = req.params;
    const select = await pool.query("SELECT url,image_id FROM images WHERE listing_id = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Request does not exist!`);
    }
    const newList = await pool.query("SELECT url, image_id FROM images WHERE listing_id = $1", [
      id
    ]);

    res.json(newList.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.getListingViews =  async (req,res) => {
  try {
    const current_date = ((new Date()).getMonth()) +'/'+ ((new Date()).getFullYear())
      
    const select = await pool.query(`SELECT listing_id , view_count FROM listing_views WHERE period = $1 ORDER BY view_count ASC LIMIT 5 ` ,[current_date])
    

   
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};



exports.test =  async (req,res) => {
  try {
       
    const current_date = ((new Date()).getMonth() + 1) +'/'+ ((new Date()).getFullYear())
    console.log('select')
   
    const select = await pool.query(`SELECT * FROM listing_views WHERE period = $1 ORDER BY view_count ASC LIMIT 5 ` ,[current_date ])

 
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.getFourListings =  async (req,res) => {
  try {
     
    const select = await pool.query("SELECT * FROM listing ORDER BY date_created LIMIT 4 ")

   
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.deleteListingImage =  async (req,res) => {
  try {
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM images WHERE image_id = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Image does not exist!`);
    }
    const deleteListing = await pool.query("DELETE FROM images WHERE image_id = $1", [
      id
    ]);
    res.json("Listing Image was deleted!");
  } catch (err) {
    console.log(err.message);
  }
};


exports.updateListing =  async (req,res) => {
  try {
    const { id } = req.params;
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields,files) => {

      if (err) {
        return res.status(400).json({
            error: 'Image could not be uploaded'
        });
    }

    else{

      const { listing_id,listing_title,description,property_type,purchase_type,
        rooms,has_parking,has_gym,has_pool,is_furnished,off_plan,
         price,location_id,bathrooms,images,imageCount
     
     
    } = fields;
    let l_id = ''
    

    let query = 'UPDATE listing SET '
    
    if(listing_title){
      query = query + `listing_title = '${fields.listing_title}' ` 
    }
    if(description){
      query = query + ` , description = '${fields.description}' ` 
    }
    if(property_type){
      query = query + ` , property_type = '${fields.property_type}' ` 
    }
    if(purchase_type){
      query = query + ` , purchase_type = '${fields.purchase_type}' ` 
    }
    if(rooms){
      query = query + ` , rooms = ${fields.rooms} ` 
    }
    if(has_parking){
      query = query + ` , has_parking = ${fields.has_parking === 1 ? true : false} ` 
    }
    if(has_gym){
      query = query + ` , has_gym = ${fields.has_gym === 1 ? true : false} ` 
    }
    if(has_pool){
      query = query + ` , has_pool = ${fields.has_pool === 1 ? true : false} ` 
    }
    if(is_furnished){
      query = query + ` , is_furnished = ${fields.is_furnished === 1 ? true : false} ` 
    }

    if(off_plan){
      query = query + ` , off_plan = ${fields.off_plan === 1 ? true : false} ` 
    }
    if(is_furnished){
      query = query + ` , is_furnished = ${fields.is_furnished === 1 ? true : false} ` 
    }
    if(price){
      query = query + ` , price = ${fields.price} ` 
    }
    if(location_id){
      query = query + ` , location_id = ${fields.location_id} ` 
    }
    if(bathrooms){
      query = query + ` , bathrooms = ${fields.bathrooms} ` 
    }
    
      
    
   
    console.log(query)

    if(files.images){
      for(var i = 0; i<files.images.length; i++){
      
        let fileName = files.images[i].path

     
  

       
   // Read content from the files
   const fileContent = fs.readFileSync(fileName);

   // Setting up S3 upload parameters
   const params = {
       Bucket: 'swiftimages',
       Key: files.images[i].name, // File name you want to save as in S3
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
                 [fields.listing_id,(data.Location)]
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
   


    if(files.thumbnail){
      let fileName = files.thumbnail.path

      const fileContent = fs.readFileSync(fileName);
                  
                      // Setting up S3 upload parameters
                      const params = {
                          Bucket: 'swiftimages',
                          Key: files.thumbnail.name, // File name you want to save as in S3
                          Body: fileContent
                      };
              
                      
                  
                      // Uploading files to the bucket
                      s3.upload(params, async function(err, data) {
                        try{
                          if (err) {
                              throw err;
                          }
              
                          console.log(`File uploaded successfully. ${data.Location}`);
                          query = query + ` , thumbnail = '${data.Location}' ` 
                          query = query + ` WHERE listing_id = ${fields.listing_id} ` 
                          console.log(query)
       const updateListing = await pool.query(
        query);
  
      res.json("Location was updated!");

                        }
                        catch (err) {
                          console.error(err.message);
                          return;
                         } 

                        })

      
    }
    else{
      query = query + ` WHERE listing_id = ${fields.listing_id} ` 
      const updateListing = await pool.query(query);
  
      res.json("Listing was updated!");
    }

    

    }
    
    })
  } catch (err) {
    console.error(err.message);
  }
}

exports.getAllClientRequests =  async (req,res) => {
  try {
     
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM client_requests")

    
   

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};


exports.changeClientRequestStatus =  async (req,res) => {
 
  try {
  
    const { id } = req.params;

   
    
    
    

     
      const updateRow = await pool.query("UPDATE client_requests SET status = $1 WHERE cid = $2 " ,['read',id])

      res.json({"success":"Client Request was updated"});
   
    
  } catch (err) {
    console.error(err.message);
  }


};


// ---- Request Properties

exports.propertyRequest =  async (req,res) => {
  try {
      
      const { fullname,email,phone,property_type,budget,purchase_type,location,rooms,comment } = req.body.values;
     

      const propertyRequests = await pool.query(
        "INSERT INTO property_requests (fullname,email,phone,property_type,budget,purchase_type,location,rooms,comment,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
        [fullname,email,phone,property_type,budget,purchase_type,location,rooms,comment,'unread']
      );
  
      res.json(propertyRequests.rows[0]);
    } catch (err) {
      console.error(err.message);
    }


};

exports.viewPropertyRequest =  async (req,res) => {
  try {
       
    const select = await pool.query("SELECT * FROM property_requests ")

   
  

    res.json(select.rows);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getPropertyRequest =  async (req,res) => {
  try {
     
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM property_requests WHERE property_id = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Request does not exist!`);
    }
    const newList = await pool.query("SELECT * FROM property_requests WHERE property_id = $1", [
      id
    ]);

    res.json(newList.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};

exports.clientRequest =  async (req,res) => {
  try {
    console.log('here o')

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
       
          const { fullname,email,phone,price,purchase_type,comment,rooms,property_type,location
           
          } = fields;
          console.log('fields')
          console.log(fields)
          let l_id = ''
          
          console.log(files.images)
        
      
         

       

                  
                    
          const newClientRequest = await pool.query(
            "INSERT INTO client_requests (fullname,email,phone,price,purchase_type,client_message,bedrooms,property_type,property_location,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
            [fullname,email,phone,price,purchase_type,comment,rooms,property_type,location,'pending']
          );
      
          res.json(newClientRequest.rows[0]);
          console.log('Request Added')
          console.log(newClientRequest.rows[0])

          l_id = newClientRequest.rows[0].cid
          console.log(newClientRequest.rows[0].cid)


                       
      for(var i = 0; i<files.images.length; i++){
    
        let fileName = files.images[i].path

     
  

       
   // Read content from the files
   const fileContent = fs.readFileSync(fileName);

   // Setting up S3 upload parameters
   const params = {
       Bucket: 'swiftimages',
       Key: files.images[i].name, // File name you want to save as in S3
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
                 "INSERT INTO request_images(cid,url) VALUES($1,$2) RETURNING *",
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

exports.changePropertyRequestStatus =  async (req,res) => {
 
    try {
    
      const { id } = req.params;
  
     
      
      
      
  
       
        const updateRow = await pool.query("UPDATE property_requests SET status = $1 WHERE property_id = $2 " ,['read',id])
  
        res.json({"success":"Property Request was updated"});
     
      
    } catch (err) {
      console.error(err.message);
    }
  
  
  };
  

  exports.getListingRequestImages =  async (req,res) => {
    try {
       
      const { id } = req.params;
      const select = await pool.query("SELECT url,image_id FROM request_images WHERE cid = $1", [
        id
      ])
  
      if (select.rows.length === 0) {
        return res.status(401).json(`Request does not exist!`);
      }
      const newList = await pool.query("SELECT url, image_id FROM request_images WHERE cid = $1", [
        id
      ]);
  
      res.json(newList.rows);
    } catch (err) {
      console.error(err.message);
    }
  };
