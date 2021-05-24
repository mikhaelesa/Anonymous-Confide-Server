import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sqlQuery } from "../utils/functions.utill";
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
    sqlQuery(query, res);
  } catch (e) {
    // On server side error
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let query = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(query, async (err, result) => {
    if (err) throw err;
    const user = JSON.parse(JSON.stringify(result))[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        environments.jwtAccessToken
      );
      res.status(200).json({
        status: 200,
        token,
      });
    }
  });
};
