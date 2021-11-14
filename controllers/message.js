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


exports.clientMessage =  async (req,res) => {
    try {
        
        const { firstname,lastname,title,email,phone,message} = req.body.values;
        

        const newClientMessage = await pool.query(
          "INSERT INTO messages(firstname,lastname,title,email,phone,client_message,status) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
          [firstname,lastname,title,email,phone,message,'unread']
        );
    
        res.json(newClientMessage.rows[0]);
      } catch (err) {
        console.error(err.message);
      }


};


exports.getMessages =  async (req,res) => {
    try {
       
      let read = req.body.read;
      let unread = req.body.unread;
      let query = ""
      
      const select = await pool.query(`SELECT * FROM messages `)

     
    
  
      res.json(select.rows);
    } catch (err) {
      console.error(err.message);
    }
  };





  exports.getMessage =  async (req,res) => {
    try {
      const { id } = req.params;
      const select = await pool.query("SELECT * FROM messages WHERE message_id = $1", [
        id
      ])

      if (select.rows.length === 0) {
        return res.status(401).json(`Message does not exist!`);
      }
      const todo = await pool.query("SELECT * FROM messages WHERE message_id = $1", [
        id
      ]);
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  };
  

  exports.changeMessageStatus =  async (req,res) => {
 
    try {
    
      const { id } = req.params;
  
     
      
      
      
  
       
        const updateRow = await pool.query("UPDATE messages SET status = $1 WHERE message_id = $2 " ,['read',id])
  
        res.json({"success":"Message was updated"});
     
      
    } catch (err) {
      console.error(err.message);
    }
  
  
  };
