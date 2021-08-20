const Pool = require("pg").Pool;

const pool = new Pool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  port: 5432,
  database: process.env.DATABASE
});

module.exports = pool;