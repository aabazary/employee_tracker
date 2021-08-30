const inquirer = require("inquirer")
const mysql = require("mysql2")
const ct = require('console.table');
const express = require('express');
const db = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


function initPrompt() {
  inquirer.prompt([{
    type: "list",
    message: "Make a Selection:",
    name: "choice",
    choices: [
      "View All Departments?",
      "View All Roles?",
      "View all Employees",
      "Add Department?",
      "Add Role?",
      "Add Employee?",
      "Update an Employee Role?",
    ]
  }]).then(function (event) {
    switch (event.choice) {
      case "View All Departments?":
        viewAllDepartments();
        break;

      case "View All Roles?":
        viewAllRoles();
        break;
      case "View all Employees":
        viewAllEmployees();
        break;

      case "Add Department?":
        addDepartment();
        break;

      case "Add Role?":
        addRole();
        break;

      case "Add Employee?":
        addEmployee();
        break;

      case "Update an Employee Role?":
        addEmployeeRole();
        break;

    }
  })
}
function viewAllDepartments(){
//  SELECT * FROM department;
  db.query("SELECT * FROM department",
  function (err, results) {
    if (err) throw err
    console.table(results)
    initPrompt()
})};

function viewAllRoles(){
// SELECT * FROM role;
db.query("SELECT * FROM role",
function (err, results) {
  if (err) throw err
  console.table(results)
  initPrompt()
})};
function viewAllEmployees(){
//SELECT * FROM employee;
db.query("SELECT * FROM employee",
function (err, results) {
  if (err) throw err
  console.table(results)
  initPrompt()
})};

function addDepartment(){};
function addRole(){};
function addEmployee(){};
function addEmployeeRole(){};

initPrompt()