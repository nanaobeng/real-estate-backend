const Pool = require("pg").Pool;

const pool = new Pool({
  host: 'tai.db.elephantsql.com' ,
  user: 'inrqidot' ,
  password: 'a7hYcU8yvE6tBuihpHTLCPRtMNCz79Ot',
  port: 5432,
  database: 'inrqidot'
});

module.exports = pool;