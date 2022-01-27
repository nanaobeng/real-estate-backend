const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const validInfo = require("../utils/validation");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../utils/authorize");

exports.register =  async (req,res) => {
    
    const { email, password } = req.body;
   
  try {
    const user = await pool.query("SELECT * FROM administrators WHERE email = $1", [
      email
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
  
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO administrators (firstname, lastname,email, passcode,status,resetlink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstname,lastname, email, bcryptPassword,'actives','testlink']
    );

    
    console.log('success')
    return res.json({ success: 'Administrator Account Created' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

};

exports.login =  async (req,res) => {

    const { email, password } = req.body;
    console.log(email)
    query = `SELECT * FROM administrators WHERE email ='${email}'`
    console.log(query)

    try {
      const user = await pool.query(query)
  
      if (user.rows.length === 0) {
        return res.status(401).json({error:"Invalid Credentials"});
      }
  
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].passcode
      );
     
      if (!validPassword) {
       
        return res.status(401).json({error:"Invalid Credentials"});
      }
      const token = jwt.sign({user_id: user.rows[0].user_id , email:user.rows[0].email}, process.env.jwtSecret)
      res.cookie('t',token,{expire: new Date() + 9999})

      
      const user_id  = user.rows[0].user_id
      const email  = user.rows[0].email
      return res.json ({ token, user: {user_id ,email}})
    } catch (err) {
      console.error(err.message);
      return res.status(401).json({
        error: "Invalid Credentials"
    });
    }



};


exports.deleteAccount =  async (req,res) => {
  try {
    const { id } = req.params;
    const select = await pool.query("SELECT * FROM administrators WHERE user_id = $1", [
      id
    ])

    if (select.rows.length === 0) {
      return res.status(401).json(`Account does not exist!`);
    }
    const deleteAdmin = await pool.query("DELETE FROM administrators WHERE user_id = $1", [
      id
    ]);
    res.json("Account was deleted!");
  } catch (err) {
    console.log(err.message);
  }
};



exports.isAuth =  async (req,res) => {

    try {
        res.json(true);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
};


exports.signout = (req,res) => {
  res.clearCookie('t')
  res.json({message: "Signout Success"})
};


