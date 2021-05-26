import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  generateRefreshToken,
  generateToken,
  sqlQuery,
} from "../utils/functions.utill";
import db from "../configs/db.config";
import jwt from "jsonwebtoken";
import environments from "../configs/environment.config";

/**
 * Controller for user registration.
 *
 * @param req request
 * @param res response
 * @param next next function
 * @returns Successful user creation
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Necessary data is not provided",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const query = `INSERT INTO users (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${hashedPassword}')`;
    sqlQuery(query);
    return res.status(200).json({
      status: 200,
      message: "User created successfully",
    });
  } catch (e) {
    // On server side error
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

/**
 * Controller for user registration.
 *
 * @param req request
 * @param res response
 * @param next next function
 * @returns Successful user creation
 */
export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let query = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(query, async (err, result) => {
    if (err) throw err;
    const user = JSON.parse(JSON.stringify(result))[0];
    if (await bcrypt.compare(password, user.password)) {
      const dataToSign = { id: user.id };
      const token = generateToken(dataToSign);
      const refreshToken = generateRefreshToken(dataToSign);
      let query = `UPDATE users SET refresh_token = '${refreshToken}' WHERE id = '${user.id}'`;
      sqlQuery(query);
      res.status(200).json({
        status: 200,
        token,
        refreshToken,
      });
    }
  });
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  const decoded: any = jwt.decode(token);
  let query = `UPDATE users SET refresh_token = NULL WHERE id = '${decoded.id}'`;
  sqlQuery(query);
  return res.status(200).json({
    status: 200,
    message: "Logout success",
  });
};
