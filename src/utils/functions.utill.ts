import db from "../configs/db.config";
import jwt, { SignOptions } from "jsonwebtoken";
import environments from "../configs/environment.config";

export const sqlQuery = (query: string) => {
  return db.query(query, (err, result) => {
    if (err) throw err;
    else console.log("Query success");
  });
};

export const generateToken = (
  data: any,
  options: SignOptions = { expiresIn: "15s" }
) => {
  return jwt.sign(data, environments.jwtAccessToken, options);
};

export const generateRefreshToken = (
  data: any,
  options: SignOptions = { expiresIn: "7d" }
) => {
  return jwt.sign(data, environments.jwtRefreshToken, options);
};
