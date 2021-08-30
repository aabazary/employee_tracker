const mysql = require('mysql2');

// Enable access to .env variables
require('dotenv').config();

// Use environment variables to connect to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employee_tracker_db'
});

module.exports = connection;
