import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  evaluateSQLError,
  generateRefreshToken,
  generateToken,
  sqlQuery,
} from "../utils/functions.utill";
import jwt, { VerifyErrors } from "jsonwebtoken";
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "../utils/errors.util";
import { HTTPStatusCode } from "../utils/httpStatus.util";
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
      return res.status(HTTPStatusCode.code.badRequest).json({
        status: HTTPStatusCode.code.badRequest,
        message: "Necessary data is not provided",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const profileId = uuidv4();
    const queryUsers = `INSERT INTO users (id, email, password) VALUES ('${userId}', '${email}', '${hashedPassword}')`;
    const queryProfiles = `INSERT INTO profiles (id, user_id, username) VALUES ('${profileId}', '${userId}', '${username}')`;
    const users = await sqlQuery(queryUsers).catch((err) => err);
    if (!users.success) {
      evaluateSQLError(users.data);
    }
    const profiles = await sqlQuery(queryProfiles).catch((err) => err);
    if (!profiles.success) {
      evaluateSQLError(profiles.data);
    } else {
      return res.status(HTTPStatusCode.code.ok).json({
        status: HTTPStatusCode.code.ok,
        message: "User created successfully",
      });
    }
  } catch (e) {
    if (e instanceof BadRequest) {
      return res.status(HTTPStatusCode.code.badRequest).json({
        status: HTTPStatusCode.code.badRequest,
        message: "User already exist",
      });
    }
    return res.status(HTTPStatusCode.code.internalServerError).json({
      status: HTTPStatusCode.code.internalServerError,
      message: HTTPStatusCode.status.internalServerError,
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
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    const getUser = await sqlQuery(query);
    if (!getUser.success) {
      console.log(getUser.data);
      evaluateSQLError(getUser.data);
    }
    const user = getUser.data[0];
    if (!user) {
      throw new NotFound("User not found");
    }
    if (await bcrypt.compare(password, user.password)) {
      const dataToSign = { id: user.id };
      const token = generateToken(dataToSign);
      const refreshToken = generateRefreshToken(dataToSign);
      let query = `UPDATE users SET refresh_token = '${refreshToken}' WHERE id = '${user.id}'`;
      const updateUser = await sqlQuery(query);
      if (updateUser.success) {
        return res.status(200).json({
          status: 200,
          message: "Login success",
          token,
          refreshToken,
        });
      } else {
        throw new InternalServerError("Internal server error");
      }
    } else {
      throw new Forbidden("Wrong password");
    }
  } catch (e) {
    if (e instanceof NotFound) {
      return res.status(HTTPStatusCode.code.notFound).json({
        status: HTTPStatusCode.code.notFound,
        message: e.message,
      });
    }
    if (e instanceof BadRequest) {
      return res.status(HTTPStatusCode.code.badRequest).json({
        status: HTTPStatusCode.code.badRequest,
        message: e.message,
      });
    }
    return res.status(HTTPStatusCode.code.internalServerError).json({
      status: HTTPStatusCode.code.internalServerError,
      message: e.message,
      error: e,
    });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new Unauthorized("Token is not provided");
    }
    jwt.verify(
      token,
      environments.jwtAccessToken,
      (err: VerifyErrors | null, val: any) => {
        if (err) {
          throw new Forbidden("Invalid token");
        }
      }
    );
    const decoded: any = jwt.decode(token);
    let query = `UPDATE users SET refresh_token = NULL WHERE id = '${decoded.id}'`;
    const updateRefreshToken = await sqlQuery(query);
    if (updateRefreshToken.success) {
      return res.status(HTTPStatusCode.code.ok).json({
        status: HTTPStatusCode.code.ok,
        message: "Logout success",
      });
    } else {
      throw new InternalServerError(HTTPStatusCode.status.internalServerError);
    }
  } catch (e) {
    if (e instanceof Forbidden) {
      return res.status(HTTPStatusCode.code.forbidden).json({
        status: HTTPStatusCode.code.forbidden,
        message: e.message,
      });
    }
    if (e instanceof Unauthorized) {
      return res.status(HTTPStatusCode.code.unauthorized).json({
        status: HTTPStatusCode.code.unauthorized,
        message: e.message,
      });
    }
    if (e instanceof InternalServerError) {
      return res.status(HTTPStatusCode.code.internalServerError).json({
        status: HTTPStatusCode.code.internalServerError,
        message: HTTPStatusCode.status.internalServerError,
      });
    }
  }
};
