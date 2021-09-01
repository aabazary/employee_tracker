INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Manufacturing");
INSERT INTO department (name)
VALUE ("Research & Development");
INSERT INTO department (name)
VALUE ("Marketing");
INSERT INTO department (name)
VALUE ("Legal");
INSERT INTO department (name)
VALUE ("Sales");


INSERT INTO role (title, salary, department_id)
VALUE ("Engineer Manager", 500000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Chief Engineer", 400000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 300000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Senior Engineer", 200000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Junior Engineer", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Manufacturing Manager", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Manufacturing Foreman", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Manufacturer", 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Developer", 200000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Researcher", 100000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Manager", 200000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Associate", 100000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 1000000, 5);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 200000, 6);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Associate", 100000, 6);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Archimedes", "of Syracuse", 1 , null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Galileo", "Galilei", 2 , null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Charles", "Darwin", 3 , 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Issac", "Newton", 4 , 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Stephen", "Hawking", 5 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Thomas", "Edison", 6 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Henry", "Ford", 7 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("John", "Smith", 8 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Steve", "Jobs", 9 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Steve", "Wozniak", 10 , 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Plato", "Aristocles", 11 , 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Jordan", "Belfort", 12 , 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Pope", "Francis", 14 , null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Teresa", "of Calcutta", 14 , null);

-- Test area for mysql commands
-- SELECT role.title, role.id, department.name, role.salary
-- FROM department
-- INNER JOIN role ON role.department_id=department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title,department.name, role.salary, CONCAT(manager.first_name, ' ' ,manager.last_name) AS Manager 
FROM employee
INNER JOIN role ON employee.role_id=role.id
INNER JOIN department ON role.department_id=department.id
LEFT OUTER JOIN employee manager ON employee.manager_id =manager.id; 

-- SELECT employee.id, CONCAT(employee.first_name," ", employee.last_name), role.title
-- FROM employee
-- INNER JOIN role ON employee.role_id=role.id

-- SELECT CONCAT(first_name, " ", last_name) FROM employee WHERE manager_id IS NULL
