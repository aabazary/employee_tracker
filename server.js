// npm packages being imported
const inquirer = require("inquirer");
const db = require("./config/connection");
const chalk = require("chalk");
const figlet = require("figlet");
const ora = require("ora");
const util = require("util");

// Promisify db.query to use async/await
db.query = util.promisify(db.query);

// Display CLI banner
console.log(chalk.blue(figlet.textSync("Employee Manager")));
console.log(chalk.green("Welcome to the Employee Management CLI!\n"));

// Main menu choices
const menuChoices = [
  "View All Departments",
  "View All Roles",
  "View All Employees",
  "View Employees by Manager",
  "View Employees by Department",
  "View Department Budget",
  "Add Department",
  "Add Role",
  "Add Employee",
  "Update an Employee's Role",
  "Update an Employee's Manager",
  "Delete Function",
  "Exit Application"
];

// =========================
//       MAIN PROMPT
// =========================
async function initPrompt() {
  try {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: chalk.yellow("Make a Selection:"),
        choices: menuChoices
      }
    ]);

    // Route to the appropriate function based on user choice
    switch (choice) {
      case "View All Departments":
        await viewAllDepartments();
        break;
      case "View All Roles":
        await viewAllRoles();
        break;
      case "View All Employees":
        await viewAllEmployees();
        break;
      case "View Employees by Manager":
        await viewEmployeesByManager();
        break;
      case "View Employees by Department":
        await viewEmployeesByDepartment();
        break;
      case "View Department Budget":
        await viewDepartmentBudget();
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "Add Role":
        await addRole();
        break;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update an Employee's Role":
        await updateEmployeeRole();
        break;
      case "Update an Employee's Manager":
        await updateEmployeeManager();
        break;
      case "Delete Function":
        await deleteFunction();
        break;
      case "Exit Application":
        console.log(chalk.red("Goodbye!"));
        process.exit();
    }
  } catch (error) {
    console.error(chalk.red("Error in main prompt:"), error);
  }
}

// =========================
//      VIEW FUNCTIONS
// =========================

// View all departments
async function viewAllDepartments() {
  try {
    const spinner = ora("Fetching departments...").start();
    const results = await db.query("SELECT id AS 'ID', name AS 'Department' FROM department");
    spinner.succeed("Departments loaded:");
    console.table(results);
  } catch (err) {
    console.error(chalk.red("Error fetching departments:"), err);
  } finally {
    initPrompt();
  }
}

// View all roles
async function viewAllRoles() {
  try {
    const spinner = ora("Fetching roles...").start();
    const results = await db.query(`
      SELECT role.title AS 'Title', role.id AS 'ID', department.name AS 'Department', role.salary AS 'Salary'
      FROM department
      INNER JOIN role ON role.department_id = department.id
      ORDER BY role.id ASC;
    `);
    spinner.succeed("Roles loaded:");
    console.table(results);
  } catch (err) {
    console.error(chalk.red("Error fetching roles:"), err);
  } finally {
    initPrompt();
  }
}

// View all employees (with LEFT JOIN to include manager info)
async function viewAllEmployees() {
  try {
    const spinner = ora("Fetching employees...").start();
    const results = await db.query(`
      SELECT employee.id AS ID,
             employee.first_name AS 'First Name',
             employee.last_name AS 'Last Name',
             role.title AS 'Title',
             department.name AS 'Department',
             role.salary AS 'Salary',
             CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
      FROM employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `);
    spinner.succeed("Employees loaded:");
    console.table(results);
  } catch (err) {
    console.error(chalk.red("Error fetching employees:"), err);
  } finally {
    initPrompt();
  }
}

// View employees by department
async function viewEmployeesByDepartment() {
  try {
    const departmentsData = await db.query("SELECT * FROM department");
    const departments = departmentsData.map(({ id, name }) => ({ name, value: id }));
    const { department } = await inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: chalk.yellow("Select A Department:"),
        choices: departments
      }
    ]);

    const spinner = ora("Fetching employees for selected department...").start();
    const results = await db.query(
      `SELECT CONCAT(first_name, ' ', last_name) AS Employees,
              department.name AS Department
       FROM employee
       JOIN role ON employee.role_id = role.id
       JOIN department ON role.department_id = department.id
       WHERE department_id = ?;`,
      [department]
    );
    spinner.succeed("Employees loaded:");
    console.table(results);
  } catch (err) {
    console.error(chalk.red("Error fetching employees by department:"), err);
  } finally {
    initPrompt();
  }
}

// View employees by manager
async function viewEmployeesByManager() {
  try {
    const managersData = await db.query("SELECT * FROM employee WHERE manager_id IS NULL");
    const managers = managersData.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    const { manager } = await inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: chalk.yellow("Select A Manager:"),
        choices: managers
      }
    ]);

    const spinner = ora("Fetching employees for selected manager...").start();
    const results = await db.query(
      "SELECT CONCAT(first_name, ' ', last_name) AS Employees FROM employee WHERE manager_id = ?",
      [manager]
    );
    spinner.succeed("Employees loaded:");
    if (results.length === 0) {
      console.log(chalk.red("This manager has no employees."));
    } else {
      console.table(results);
    }
  } catch (err) {
    console.error(chalk.red("Error fetching employees by manager:"), err);
  } finally {
    initPrompt();
  }
}

// View department budget (sum of salaries for each department)
async function viewDepartmentBudget() {
  try {
    const spinner = ora("Calculating department budgets...").start();
    const results = await db.query(`
      SELECT department_id AS ID,
             department.name AS Department,
             SUM(salary) AS Budget
      FROM role
      INNER JOIN department ON role.department_id = department.id
      GROUP BY role.department_id;
    `);
    spinner.succeed("Department budgets calculated:");
    console.table(results);
  } catch (err) {
    console.error(chalk.red("Error fetching department budgets:"), err);
  } finally {
    initPrompt();
  }
}

// =========================
//      ADD FUNCTIONS
// =========================

// Add a new department
async function addDepartment() {
  try {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.yellow("Name of new department:")
      }
    ]);
    const spinner = ora("Adding department...").start();
    await db.query("INSERT INTO department SET ?", { name });
    spinner.succeed(`Department "${name}" added successfully.`);
  } catch (err) {
    console.error(chalk.red("Error adding department:"), err);
  } finally {
    initPrompt();
  }
}

// Add a new role
async function addRole() {
  try {
    const departmentsData = await db.query("SELECT * FROM department");
    const departments = departmentsData.map(({ id, name }) => ({ name, value: id }));
    const { name: roleName, salary, department } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: chalk.yellow("Name of new role:")
      },
      {
        type: "input",
        name: "salary",
        message: chalk.yellow("Salary of the role:")
      },
      {
        type: "list",
        name: "department",
        message: chalk.yellow("Department to assign new role:"),
        choices: departments
      }
    ]);
    const spinner = ora("Adding role...").start();
    await db.query("INSERT INTO role SET ?", {
      title: roleName,
      salary,
      department_id: department
    });
    spinner.succeed(`Role "${roleName}" added successfully.`);
  } catch (err) {
    console.error(chalk.red("Error adding role:"), err);
  } finally {
    initPrompt();
  }
}

// Add a new employee
async function addEmployee() {
  try {
    const rolesData = await db.query("SELECT * FROM role");
    const roles = rolesData.map(({ id, title }) => ({ name: title, value: id }));

    // Get employees with no manager to list as potential managers
    const managersData = await db.query("SELECT * FROM employee WHERE manager_id IS NULL");
    const managers = managersData.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    managers.push({name:"None", value:null})
    const { firstname, lastname, role, manager } = await inquirer.prompt([
      {
        type: "input",
        name: "firstname",
        message: chalk.yellow("Enter employee's first name:")
      },
      {
        type: "input",
        name: "lastname",
        message: chalk.yellow("Enter employee's last name:")
      },
      {
        type: "list",
        name: "role",
        message: chalk.yellow("Select employee's role:"),
        choices: roles
      },
      {
        type: "list",
        name: "manager",
        message: chalk.yellow("Select employee's manager:"),
        choices: managers
      }
    ]);

    const spinner = ora("Adding employee...").start();
    await db.query("INSERT INTO employee SET ?", {
      first_name: firstname,
      last_name: lastname,
      role_id: role,
      manager_id: manager
    });
    spinner.succeed(`Employee "${firstname} ${lastname}" added successfully.`);
  } catch (err) {
    console.error(chalk.red("Error adding employee:"), err);
  } finally {
    initPrompt();
  }
}

// =========================
//     UPDATE FUNCTIONS
// =========================

// Update an employee's role
async function updateEmployeeRole() {
  try {
    const employeesData = await db.query("SELECT * FROM employee");
    const employees = employeesData.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    const { employee } = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: chalk.yellow("Select an employee to update their role:"),
        choices: employees
      }
    ]);

    const rolesData = await db.query("SELECT * FROM role");
    const roles = rolesData.map(({ id, title }) => ({ name: title, value: id }));

    const { role } = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: chalk.yellow("Select the new role:"),
        choices: roles
      }
    ]);

    const spinner = ora("Updating employee role...").start();
    await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [role, employee]);
    spinner.succeed("Employee role updated successfully.");
  } catch (err) {
    console.error(chalk.red("Error updating employee role:"), err);
  } finally {
    initPrompt();
  }
}

// Update an employee's manager
async function updateEmployeeManager() {
  try {
    const employeesData = await db.query("SELECT * FROM employee");
    const employees = employeesData.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    employees.push({name:"None", value:null})

    const { employee, manager } = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: chalk.yellow("Select an employee to update their manager:"),
        choices: employees
      },
      {
        type: "list",
        name: "manager",
        message: chalk.yellow("Select the new manager:"),
        choices: employees
      }
    ]);

    const spinner = ora("Updating employee manager...").start();
    // If the employee selects themselves, set manager_id to NULL
    if (employee === manager) {
      await db.query("UPDATE employee SET manager_id = NULL WHERE id = ?", [employee]);
      spinner.succeed("Employee's manager set to none.");
    } else {
      await db.query("UPDATE employee SET manager_id = ? WHERE id = ?", [manager, employee]);
      spinner.succeed("Employee manager updated successfully.");
    }
  } catch (err) {
    console.error(chalk.red("Error updating employee manager:"), err);
  } finally {
    initPrompt();
  }
}

// =========================
//      DELETE FUNCTIONS
// =========================

// Delete Function – select which delete action to take
async function deleteFunction() {
  try {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: chalk.yellow("Select delete option:"),
        choices: ["Delete Employee", "Delete Role", "Delete Department"]
      }
    ]);

    switch (choice) {
      case "Delete Employee":
        await deleteEmployee();
        break;
      case "Delete Role":
        await deleteRole();
        break;
      case "Delete Department":
        await deleteDepartment();
        break;
    }
  } catch (err) {
    console.error(chalk.red("Error in delete function:"), err);
  }
}

// Delete an employee
async function deleteEmployee() {
  try {
    const employeesData = await db.query("SELECT * FROM employee");
    const employees = employeesData.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    const { employee } = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: chalk.yellow("Select an employee to delete:"),
        choices: employees
      }
    ]);

    const spinner = ora("Deleting employee...").start();
    await db.query("DELETE FROM employee WHERE id = ?", [employee]);
    spinner.succeed("Employee deleted successfully.");
  } catch (err) {
    console.error(chalk.red("Error deleting employee:"), err);
  } finally {
    initPrompt();
  }
}

// Delete a role
async function deleteRole() {
  try {
    const rolesData = await db.query("SELECT * FROM role");
    const roles = rolesData.map(({ id, title }) => ({ name: title, value: id }));

    const { role } = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: chalk.yellow("Select a role to delete:"),
        choices: roles
      }
    ]);

    const spinner = ora("Deleting role...").start();
    await db.query("DELETE FROM role WHERE id = ?", [role]);
    spinner.succeed("Role deleted successfully.");
  } catch (err) {
    console.error(chalk.red("Error deleting role:"), err);
  } finally {
    initPrompt();
  }
}

// Delete a department
async function deleteDepartment() {
  try {
    const departmentsData = await db.query("SELECT * FROM department");
    const departments = departmentsData.map(({ id, name }) => ({ name, value: id }));

    const { department } = await inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: chalk.yellow("Select a department to delete:"),
        choices: departments
      }
    ]);

    const spinner = ora("Deleting department...").start();
    await db.query("DELETE FROM department WHERE id = ?", [department]);
    spinner.succeed("Department deleted successfully.");
  } catch (err) {
    console.error(chalk.red("Error deleting department:"), err);
  } finally {
    initPrompt();
  }
}

// Start the CLI
initPrompt();
