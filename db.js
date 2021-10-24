const Pool = require("pg").Pool;

const pool = new Pool({
  host: 'tai.db.elephantsql.com' ,
  user: 'mxqfngtt' ,
  password: 'wAgwQ0wV4jp15kmhZeSddQdFRXhx3A9j',
  port: 5432,
  database: 'mxqfngtt'
});

module.exports = pool;