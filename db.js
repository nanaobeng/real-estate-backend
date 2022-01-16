const Pool = require("pg").Pool;

const pool = new Pool({
  host: 'tyke.db.elephantsql.com' ,
  user: 'rbrssgox' ,
  password: 'SG9jx1l9opJl8bMl5IYo9wVWjQWhPE8z',
  port: 5432,
  database: 'rbrssgox'
});

module.exports = pool;