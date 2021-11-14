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


exports.countListingRequests =  async (req,res) => {
    try {
       
      const numberOfListingRequests = await pool.query("SELECT COUNT(*) FROM listing_requests WHERE status = 'pending' ")

     
    
  
      res.json(numberOfListingRequests.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };



  exports.countClientRequests =  async (req,res) => {
    try {
       
      const numberOfClientRequests = await pool.query("SELECT COUNT(*) FROM client_requests WHERE status = 'pending' ")

     
    
  
      res.json(numberOfClientRequests.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };


  exports.countNewMessages =  async (req,res) => {
    try {
       
      const numberOfNewMessages = await pool.query("SELECT COUNT(*) FROM messages WHERE status = 'unread' ")

     
    
  
      res.json(numberOfNewMessages.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };


  exports.countListings =  async (req,res) => {
    try {
       
        const select = await pool.query("SELECT COUNT(*) FROM listing ")
  
       
      
    
        res.json(select.rows[0]);
      } catch (err) {
        console.error(err.message);
      }
    };


    exports.countLocations =  async (req,res) => {
        try {
           
            const select = await pool.query("SELECT COUNT(*) FROM locations ")
      
           
          
        
            res.json(select.rows[0]);
          } catch (err) {
            console.error(err.message);
          }
        };



        exports.dashboardCount =  async (req,res) => {
            try {
               
              const numberOfListingRequests = await pool.query("SELECT COUNT(*) FROM listing_requests WHERE status = 'pending' ")
              const select = await pool.query("SELECT COUNT(*) FROM locations ")
              const listings = await pool.query("SELECT COUNT(*) FROM listing ")
              const numberOfNewMessages = await pool.query("SELECT COUNT(*) FROM messages WHERE status = 'unread' ")
              const numberOfClientRequests = await pool.query("SELECT COUNT(*) FROM client_requests WHERE status = 'pending' ")
        
             
            
          
              res.json({'listing_requests':numberOfListingRequests.rows[0],'locations':select.rows[0],'listings':listings.rows[0],'messages':numberOfNewMessages.rows[0],'client_requests':numberOfClientRequests.rows[0]});
            } catch (err) {
              console.error(err.message);
            }
          }; 