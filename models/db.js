const mysql = require('mysql');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

connection.connect(function (err) {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }
});

module.exports = connection;
