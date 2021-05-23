import mysql from "mysql";
import environments from "./environment.config";

const db = mysql.createConnection({
  host: environments.dbHost,
  user: environments.dbUser,
  password: environments.dbPassword,
  database: environments.dbName,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB");
});

export default db;
