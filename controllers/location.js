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


exports.addLocation =  async (req,res) => {
    try {
        let form = new formidable.IncomingForm();
        form.parse(req, async (err, fields) => {
            console.log(fields)
        const { city,region,country,coordinates } = fields;
       
        const select = await pool.query("SELECT * FROM locations WHERE city = $1", [
            city
          ])

          if (select.rows.length > 0) {
            return res.status(401).json(`${city} already exists`);
          }

          try{
            const newLocation = await pool.query(
                "INSERT INTO locations (city,region,country,coordinates) VALUES($1,$2,$3,$4) RETURNING *",
                [city,region,country,coordinates]
              );
              res.json(newLocation.rows[0]);
        
          }
        
            catch (e) {
                console.error('Error Occurred', e);
                throw e;
              }
          
       
        
    
        
        })
      } catch (err) {
        console.error(err.message);
      }

  
};

exports.updateLocation =  async (req,res) => {
    try {
      const { id } = req.params;
      let form = new formidable.IncomingForm();
      form.parse(req, async (err, fields) => {
      const { city,region,country,coordinates } = fields;
      console.log(fields)
      const select = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`Location does not exist!`);
      }
      const updateLocation = await pool.query(
        "UPDATE locations SET city = $2 ,region = $3,country = $4,coordinates = $5 WHERE location_id = $1",
        [id,city,region,country,coordinates]
      );
  
      res.json("Location was updated!");
      })
    } catch (err) {
      console.error(err.message);
    }
  }



  exports.getLocation =  async (req,res) => {
    try {
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`Location does not exist!`);
      }
      const todo = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
        id
      ]);
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };



  
  exports.deleteLocation =  async (req,res) => {
    try {
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM locations WHERE location_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`Location does not exist!`);
      }
      const deleteLocation = await pool.query("DELETE FROM locations WHERE location_id = $1", [
        id
      ]);
      res.json("Location was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  };


  exports.getLocations =  async (req,res) => {
    try {
      const { id } = req.params;
      
      const todo = await pool.query("SELECT * FROM locations ");
  
      res.json(todo.rows);
    } catch (err) {
      console.error(err.message);
    }
  };

  exports.getLocationByCity =  async (req,res) => {
    try {
    let city = req.body.city ;
      console.log(city)
      
      const todo = await pool.query("SELECT * FROM locations WHERE city = $1 ",[city]);
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };


  exports.deleteValidation =  async (req,res) => {
    try {
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM listing WHERE location_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.json(true);
      }
      else{
        return res.json(false);
      }
     
  
    
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
