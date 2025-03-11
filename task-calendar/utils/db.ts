import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tyme_pace",
  port: 3306,
  connectionLimit: 0,
  queueLimit: 0,
});

export default db;
