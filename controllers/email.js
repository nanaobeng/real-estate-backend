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


exports.testEmail =  async (req,res) => {
  try {

    // const { email, message, name } = req.body;


    function sesTest(emailTo, emailFrom, message, name) {
        var params = {
          Destination: {
            ToAddresses: [emailTo]
          },
          Message: {
            Body: {
              Text: { Data: "From Contact Form: " + name + "\n " + message }
            },
      
            Subject: { Data: "From: " + emailFrom }
          },
          Source: "timgbese@gmail.com"
        };
      
        return ses.sendEmail(params).promise();
      }
  
  sesTest('nanaobengmarnu@gmail.com', 'noreply@swifthomesghana.com', 'test 1', '<b>nana o</b><br/>dsds')
    .then((val) => {
      console.log("got this back", val);
      res.send("Successfully Sent Email");
    })
       
    
}
catch (err) {
       console.error(err.message);
      }


    
    

};
