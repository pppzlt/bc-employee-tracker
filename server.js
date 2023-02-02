const inquirer = require('inquirer')

const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "freedom",
    database: "employee_tracker",
  },
  console.log(`Connected to the movies_db database.`)
);
