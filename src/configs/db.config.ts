import mysql from "mysql";
import environments from "./environment.config";

const db = mysql.createPool({
  debug: ["ComQueryPacket", "RowDataPacket"],
  host: environments.dbHost,
  user: environments.dbUser,
  password: environments.dbPassword,
  database: environments.dbName,
});

export default db;
