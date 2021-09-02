# <ins>Employee Tracker</ins>
![](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)![](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)![](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
## <ins>Description</ins>
A Node based program that allows you to view and manage the departments, roles, and employees in a company, in order to organize and plan a business.
## <ins>Table of Contents</ins>
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Questions](#questions)

## <ins>Installation</ins>
Type `npm i` or `npm install` in the integrated terminal(if all the files do not install, attempt it again)

Create a .env file and input `DB_PASSWORD=your_password_here` insert your password in place of "your_password_here"

Open mysql with command `mysql -u root -p` in order to log in to your mysql. 

Run the schema with `source db/schema.sql` and run the seeds with `source db/seeds.sql`

`Exit` your sequal and you

## <ins>Usage</ins>
Start the Program by opening your integrated terminal, Then running the command `node server.js` You will be presented with a series of prompts that gives you ways to access and alter your database. You are able to view tables for Departments, Roles, Employees, Employees by Manager Name, Employee by Department and Department Budget. You may add and delete an Employee, Role and Department. You may update the role of an employee as well as change their manager.

Sample of Deployed Application:

![demo](https://user-images.githubusercontent.com/85041715/131813568-d54ce56e-bbbd-47b3-b51d-6469109ac5eb.gif)

## <ins>License</ins>
![](https://img.shields.io/badge/License-MIT%20-blue?style=flat-square)
This project is covered under MIT
## <ins>Questions</ins>
Contact Employee Tracker creator at aabazary@gmail.com. Github link: https://github.com/aabazary
