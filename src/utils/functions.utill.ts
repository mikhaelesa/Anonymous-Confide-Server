import { Response } from "express";
import db from "../configs/db.config";
import { IJSONResponse, IJSONResponseError } from "./interfaces.util";

export const sqlQuery = (
  query: string,
  res: Response,
  successJson: IJSONResponse = { message: "Request fulfiled", status: 200 },
  errorJson: IJSONResponseError = { message: "Client error", status: 400 }
) => {
  db.query(query, (err, result) => {
    if (err) {
      return res.status(errorJson.status).json(errorJson);
    } else {
      return res.status(successJson.status).json(successJson);
    }
  });
};
