import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import db from "../configs/db.config";
import environments from "../configs/environment.config";
import {
  generateRefreshToken,
  generateToken,
  sqlQuery,
} from "../utils/functions.utill";

export const renewAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
  jwt.verify(
    refreshToken,
    environments.jwtRefreshToken,
    (err: VerifyErrors | null, val: any) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "Invalid token",
        });
      }
      let sql = `SELECT refresh_token FROM users WHERE id = '${val.id}'`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        const currentRefreshToken = result[0].refresh_token;
        if (refreshToken !== currentRefreshToken) {
          return res.status(403).json({
            status: 403,
            message: "Invalid token",
          });
        }
        const dataToSign = { id: val.id };
        const newAccessToken = generateToken(dataToSign);
        const newRefreshToken = generateRefreshToken(dataToSign);
        let query = `UPDATE users SET refresh_token = '${newRefreshToken}' WHERE id = '${val.id}'`;
        sqlQuery(query);
        return res.status(200).json({
          status: 200,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    }
  );
};
