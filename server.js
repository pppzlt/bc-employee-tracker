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
      "Add Departments",
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
    choices: ["????"],
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
    choices: ["???"],
  },
  {
    type: "list",
    name: "empl_mgr",
    message: "Who is the employee's manager?",
  },
  {
    type: "list",
    name: "upd_empl",
    message: "Which employee's role do you want to update?",
    choices: ["???"],
  },
  {
    type: "list",
    name: "upd_empl_role",
    message: "Which role do you want to assign the selected employee?",
    choices: ["???"],
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
      break;
    case "Update Employee Role":
      break;
    case "View All Roles":
      await viewAllRoles();
      break;
    case "Add Role":
      break;
    case "View All Departments":
      await viewAllDept();
      break;
    case "Add Departments":
      break;
  }
};

const viewAllDept = async () => {
  let result = await db.promise().query("SELECT * FROM department");
  console.table(result[0]);
  db.end();
};

const viewAllRoles = async () => {
  let result = await db.promise().query("SELECT * FROM role");
  console.table(result[0]);
  db.end();
};

const viewAllEmployees = async () => {
  let result = await db.promise().query("SELECT * FROM employee");
  // await function (err, result) {
  console.table(result[0]);
  // });
  db.end();
};

app();
