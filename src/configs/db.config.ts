import mysql from "mysql";
import environments from "./environment.config";

const db = mysql.createPool({
  debug: ["ComQueryPacket", "RowDataPacket"],
  host: environments.dbHost,
  user: environments.dbUser,
  port: +environments.dbPort,
  password: environments.dbPassword,
  database: environments.dbName,
});

export default db;
