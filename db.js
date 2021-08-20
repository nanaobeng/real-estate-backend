const Pool = require("pg").Pool;

const pool = new Pool({
  host: 'tai.db.elephantsql.com' ,
  user: 'xcvbpydf' ,
  password: 'ylKKydaOtj4wtc2JY8aDsShxs4BDk-Vl',
  port: 5432,
  database: 'xcvbpydf'
});

module.exports = pool;