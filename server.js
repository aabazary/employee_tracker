const inquirer = require("inquirer")
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

function addDepartment(){
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Name of new department"
    }
]).then(function(res) {
    db.query( "INSERT INTO department SET ? ",
        {
          name: res.name
        },
        function(err) {
            if (err) throw err
            console.log(res.name, "added as a Department");
            initPrompt();
        }
    )
})
};
function addRole(){
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Name of new role"
    },
    {
      name: "salary",
      type: "input",
      message: "Salary of the role"
    },
    {
      name: "department",
      type: "input",
      message: "Department to assign new role"
    }
]).then(function(res) {
    db.query( "INSERT INTO role SET ? ",
        {
          title: res.name,
          salary: res.salary,
          department_id: res.department,
        },
        function(err) {
            if (err) throw err
            console.log(res.name, "added as a new Role");
            initPrompt();
        }
    )
})
};
function addEmployee(){
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "First name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Last name "
    },
    {
      name: "role",
      type: "input",
      message: "What is their role? ",
    },
    {
      name: "manager",
      type: "input",
      message: "Who is the Manager? ",
    }
  ]).then(function (res) {
    db.query("INSERT INTO employee SET ?", 
    {
        first_name: res.firstname,
        last_name: res.lastname,
        role_id: res.role,
        manager_id: res.manager
        
        
    }, function(err){
        if (err) throw err
        console.table(res.firstname,"added as a new Employee")
        initPrompt()
    })

})
};
function addEmployeeRole(){};

initPrompt()