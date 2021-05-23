import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sqlQuery } from "../utils/functions.utill";

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
  res.send("You are logging in");
};
