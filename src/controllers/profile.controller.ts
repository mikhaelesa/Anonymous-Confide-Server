import { NextFunction, Request, Response } from "express";
import db from "../configs/db.config";

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  let sql = `SELECT email, username, name, isAnonymous FROM users WHERE id = "${req.user.id}"`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    const parsedResult = JSON.parse(JSON.stringify(result[0]));
    parsedResult["isAnonymous"] = parsedResult.isAnonymous === 1 ? true : false;
    res.status(200).json(parsedResult);
  });
};
