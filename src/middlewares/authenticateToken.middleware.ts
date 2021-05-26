import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import environments from "../configs/environment.config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
  jwt.verify(token, environments.jwtAccessToken, (err, val) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        message: "Invalid token",
      });
    }
    req.user = val;
    next();
  });
};
