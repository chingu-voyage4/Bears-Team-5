const mysql = require('mysql');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

module.exports = pool;
