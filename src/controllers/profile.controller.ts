import { NextFunction, Request, Response } from "express";
import { ProfileModel } from "../models/profile.model";
import { sqlCallback } from "../utils/functions.utill";

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    let query = `SELECT u.id, u.email, p.name, p.image, p.username, p.is_anonymous AS isAnonymous FROM users AS u JOIN profiles AS p ON(p.user_id = u.id) WHERE u.id = '${id}'`;
    sqlCallback(query, (result: ProfileModel[]) => {
      const profile = result[0];
      profile["isAnonymous"] = profile["isAnonymous"] > 0 ? true : false;
      return res.status(200).json({
        status: 200,
        data: profile,
      });
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: e,
    });
  }
};
