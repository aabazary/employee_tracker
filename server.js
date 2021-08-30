const inquirer = require("inquirer")
const ct = require('console.table');
const express = require('express');
const db = require('./config/connection');
const app = express();


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
        updateEmployeeRole();
        break;

    }
  })
}

function viewAllDepartments() {
  db.query("SELECT * FROM department",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};

function viewAllRoles() {
  db.query("SELECT role.title, role.id, department.name, role.salary FROM department INNER JOIN role ON role.department_id=department.id",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};

function viewAllEmployees() {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title,department.name, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};

function addDepartment() {
  inquirer.prompt([{
    name: "name",
    type: "input",
    message: "Name of new department"
  }]).then(function (res) {
    db.query("INSERT INTO department SET ? ", {
        name: res.name
      },
      function (err) {
        if (err) throw err
        console.log(res.name, "added as a Department");
        initPrompt();
      }
    )
  })
};

function addRole() {
  inquirer.prompt([{
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
  ]).then(function (res) {
    db.query("INSERT INTO role SET ? ", {
        title: res.name,
        salary: res.salary,
        department_id: res.department,
      },
      function (err) {
        if (err) throw err
        console.log(res.name, "added as a new Role");
        initPrompt();
      }
    )
  })
};

function addEmployee() {
  inquirer.prompt([{
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
    db.query("INSERT INTO employee SET ?", {
      first_name: res.firstname,
      last_name: res.lastname,
      role_id: res.role,
      manager_id: res.manager


    }, function (err) {
      if (err) throw err
      console.table(res.firstname, "added as a new Employee")
      initPrompt()
    })

  })
};

function updateEmployeeRole() {

  db.query(`SELECT * FROM employee`, (err, data) => {
    if (err) throw err;

    const employees = data.map(({
      id,
      first_name,
      last_name
    }) => ({
      name: first_name + " " + last_name,
      value: id
    }));

    inquirer.prompt([{
        type: 'list',
        name: 'name',
        message: "Select an Employee to Update their Role",
        choices: employees
      }])
      .then(event => {
        const employee = event.name;
        //creating an array to put the results in order to query the updated results
        const updateArray = [];
        updateArray.push(employee);

        db.query(`SELECT * FROM role`, (err, data) => {
          if (err) throw err;

          const roles = data.map(({
            id,
            title
          }) => ({
            name: title,
            value: id
          }));

          inquirer.prompt([{
              type: 'list',
              name: 'role',
              message: "Select a new Role?",
              choices: roles
            }])
            .then(event=> {
              const role = event.role;
              updateArray.push(role);
            
              //need to swap array to get role_id value first
              let employee = updateArray[0]
              updateArray[0] = role
              updateArray[1] = employee


              db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, updateArray, (err, result) => {
                if (err) throw err;
                console.log("Employee Updated, View all Employees to see update");

                initPrompt();
              });
            });
        });
      });
  });
};

initPrompt()