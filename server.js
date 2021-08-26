const inquirer = require("inquirer")
const mysql = require("mysql2")
const ct = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_tracker_db',
    },
    console.log(`Connected to the employee_tracker database.`)
  );