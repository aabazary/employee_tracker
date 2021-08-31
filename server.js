//npm packages being imported
const inquirer = require("inquirer")
const ct = require('console.table');
const db = require('./config/connection');

//function to initialize prompt that calls an inquirer prompt that allows the user to select from each available function
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
//function showing table for department
function viewAllDepartments() {
  db.query("SELECT * FROM department",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};
//function showing table for roles
function viewAllRoles() {
  db.query("SELECT role.title, role.id, department.name, role.salary FROM department INNER JOIN role ON role.department_id=department.id ORDER BY id ASC;",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};
//function showing table for employees
function viewAllEmployees() {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title,department.name, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id ORDER BY id ASC;",
    function (err, results) {
      if (err) throw err
      console.table(results)
      initPrompt()
    })
};
//function adding department into database
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
//function adding role into database
function addRole() {
  db.query(`SELECT * FROM department`, async (err, data) => {
    if (err) throw err;

    const departments = await data.map(({
      id,
      name
    }) => ({
      name: name,
      value: id

    }));
    //inquirer prompt that presents a list of departments to choose from after inputting role name and salary
  inquirer.prompt([{
      name: "name",
      type: "input",
      message: "Name of new role:"
    },
    {
      name: "salary",
      type: "input",
      message: "Salary of the role:"
    },
    {
      name: "department",
      type: "list",
      message: "Department to assign new role:",
      choices: departments
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
})
};

//function adding employee into database
function addEmployee() {
  //async function mapping roles to call as a list in the prompt
  db.query(`SELECT * FROM role`, async (err, data) => {
    if (err) throw err;
    const roles = await data.map(({
      id,
      title
    }) => ({
      name: title,
      value: id
    }));
//async function mapping managers to call as a list in the prompt
    db.query(`SELECT * FROM employee WHERE manager_id IS NULL`, async (err, data) => {
      if (err) throw err;
      const managers = await data.map(({
        first_name,
        last_name,
        id
      }) => ({
        name: first_name + " " + last_name,
        value: id
      }));
//inquirer prompts within the addEmployee selection of the initPrompt
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
          type: "list",
          message: "What is their role? ",
          choices: roles
        },
        {
          name: "manager",
          type: "list",
          message: "Who is their Manager? ",
          choices: managers
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
    })
  })
};

//function to update employee in the database
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
    //inquirer prompt that presents a list of employees to choose from
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
          //inquirer prompt that presents a list of roles to choose from 
          inquirer.prompt([{
              type: 'list',
              name: 'role',
              message: "Select a new Role?",
              choices: roles
            }])
            .then(event => {
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