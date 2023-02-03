const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

const prompt = inquirer.prompt;
const questions = [
  {
    type: "list",
    name: "root",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
  },
  {
    type: "input",
    name: "dept",
    message: "What is the name of the department?",
  },
  {
    type: "input",
    name: "role",
    message: "What is the name of the role?",
  },
  {
    type: "input",
    name: "role_salary",
    message: "What is the salary of the role?",
  },
  {
    type: "list",
    name: "role_dept",
    message: "Whick department does the role belong to?",
    choices: [],
  },
  {
    type: "input",
    name: "firstname",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "lastname",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "empl_role",
    message: "What is the employee's role",
    choices: [],
  },
  {
    type: "list",
    name: "empl_mgr",
    message: "Who is the employee's manager?",
    choices: [],
  },
  {
    type: "list",
    name: "upd_empl",
    message: "Which employee's role do you want to update?",
    choices: [],
  },
  {
    type: "list",
    name: "upd_empl_role",
    message: "Which role do you want to assign the selected employee?",
    choices: [],
  },
];

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "freedom",
    database: "employee_tracker",
  },
  console.log(`Connected to the movies_db database.`)
);

const app = async () => {
  let ans = await prompt([questions[0]]);
  switch (ans.root) {
    case "View All Employees":
      await viewAllEmployees();
      break;
    case "Add Employee":
      await addEmployee();
      break;
    case "Update Employee Role":
      await updateEmployeeRole();
      break;
    case "View All Roles":
      await viewAllRoles();
      break;
    case "Add Role":
      await addRole();
      break;
    case "View All Departments":
      await viewAllDept();
      break;
    case "Add Department":
      await addDept();
      break;
  }
};

const viewAllDept = async () => {
  let result = await db.promise().query("SELECT * FROM department");
  console.table(result[0]);
  // db.end(); //can be comment out
};

const viewAllRoles = async () => {
  let result = await db
    .promise()
    .query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id"
    );
  console.table(result[0]);
  // db.end(); //can be comment out
};

const viewAllEmployees = async () => {
  let result = await db
    .promise()
    .query(
      "SELECT T1.id, T1.first_name, T1.last_name, role.title, department.name, role.salary, CONCAT(T2.first_name,' ',T2.last_name) AS manager FROM employee T1 LEFT JOIN role ON T1.role_id=role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee T2 ON T1.manager_id = T2.id ORDER BY T1.id"
    );
  // await function (err, result) {
  console.table(result[0]);
  // });
  // db.end(); //can be comment out
};

const addDept = async () => {
  let ans = await prompt([questions[1]]);
  await db
    .promise()
    .query(`INSERT INTO department (name) VALUES ('${ans.dept}')`);
  console.log(`Added ${ans.dept} to the database`);
  // db.end(); //can be comment out
};

const addRole = async () => {
  //query table department first to get all the new departments
  let [results, fields] = await db.promise().query("SELECT * FROM department");
  questions[4].choices = [];
  results.forEach((key) => {
    questions[4].choices.push(key.name);
  });
  console.log(questions[4].choices);

  let ans = await prompt([questions[2], questions[3], questions[4]]);
  //get the dept id through answer to questions
  let dept_id = results.find((key) => key.name === ans.role_dept).id;
  await db
    .promise()
    .query(
      `INSERT INTO role (title, salary, department_id) VALUES ('${ans.role}',${ans.role_salary},${dept_id})`
    );
  console.log(`Added ${ans.role} to the database`);
  // db.end(); //can be comment out
};

const addEmployee = async () => {
  //query role table to get new roles
  let [results, fields] = await db.promise().query("SELECT * FROM role");
  questions[7].choices = [];
  results.forEach((key) => {
    questions[7].choices.push(key.title);
  });
  // console.log(questions[7].choices)
  //query employee table to get employee names
  let [results_emp, fields_emp] = await db
    .promise()
    .query("SELECT * FROM employee");
  questions[8].choices = [];
  results_emp.forEach((key) => {
    questions[8].choices.push(key.first_name + " " + key.last_name);
  });
  //added none to the list
  questions[8].choices.unshift("None");
  // console.log(questions[8].choices)

  let ans = await prompt([
    questions[5],
    questions[6],
    questions[7],
    questions[8],
  ]);
  //get the role id and manager id
  let role_id = results.find((key) => key.title === ans.empl_role).id;
  let manager_id =
    ans.empl_mgr !== "None"
      ? results_emp.find(
          (key) => ans.empl_mgr === key.first_name + " " + key.last_name
        ).id
      : null;
  // console.log(role_id);
  // console.log(manager_id);
  // console.log(`${ans.firstname},${ans.lastname},${role_id},${manager_id}`)
  await db
    .promise()
    .query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${ans.firstname}','${ans.lastname}',${role_id},${manager_id})`
    );
  console.log(`Added ${ans.firstname + " " + ans.lastname} to the database`);
  // db.end(); //can be comment out
};

const updateEmployeeRole = async () => {
  //query the employee table and populate list choices
  let [results_emp, fields_epm] = await db
    .promise()
    .query("SELECT * FROM employee");
  questions[9].choices = [];
  results_emp.forEach((key) => {
    questions[9].choices.push(key.first_name + " " + key.last_name);
  });
  //query the role table
  let [results_role, fields_role] = await db
    .promise()
    .query("SELECT * FROM role");
  questions[10].choices = [];
  results_role.forEach((key) => {
    questions[10].choices.push(key.title);
  });
  console.log(questions[9].choices);
  console.log(questions[10].choices);

  let ans = await prompt([questions[9], questions[10]]);
  //get the employee and the new role id;
  let emp_id = results_emp.find(
    (key) => ans.upd_empl === key.first_name + " " + key.last_name
  ).id;
  let role_id = results_role.find((key) => key.title === ans.upd_empl_role).id;
  await db
    .promise()
    .query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${emp_id}`);
  console.log(`Updated employee's role`);
  // db.end(); //can be comm out
};

// ---------come back after end
(async () => {
  while (1) {
    await app();
  }
})();

// app();
