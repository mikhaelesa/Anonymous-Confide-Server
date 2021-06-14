import db from "../configs/db.config";
import jwt, { SignOptions } from "jsonwebtoken";
import environments from "../configs/environment.config";
import { IPromiseResult } from "./interfaces.util";
import { BadRequest, InternalServerError } from "./errors.util";
import { HTTPStatusCode } from "./httpStatus.util";

export const sqlQuery = (query: string) => {
  return new Promise<IPromiseResult>((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          success: false,
          data: JSON.parse(JSON.stringify(err)),
        });
      } else {
        return resolve({
          success: true,
          data: JSON.parse(JSON.stringify(result)),
        });
      }
    });
  });
};

export const sqlCallback = (query: string, callback: (result: any) => void) => {
  return db.query(query, (err, result) => {
    if (err) callback(JSON.parse(JSON.stringify(err)));
    else callback(JSON.parse(JSON.stringify(result)));
  });
};

export const generateToken = (
  data: any,
  options: SignOptions = { expiresIn: "1h" }
) => {
  return jwt.sign(data, environments.jwtAccessToken, options);
};

export const generateRefreshToken = (
  data: any,
  options: SignOptions = { expiresIn: "7d" }
) => {
  return jwt.sign(data, environments.jwtRefreshToken, options);
};

export const datetimeToUnix = (datetime: string) => {
  return new Date(datetime.substr(0, datetime.indexOf("."))).getTime();
};

export const evaluateSQLError = (err: any) => {
  console.log(err);
  switch (err.code) {
    case "ER_NO_DUP_ENTRY":
    case "ER_NO_REFERENCED_ROW_2":
    case "ER_BAD_NULL_ERROR":
    case "ER_BAD_FIELD_ERROR":
      throw new BadRequest(HTTPStatusCode.status.badRequest);
    case "ER_NO_DB_ERROR":
    case "ER_BAD_DB_ERROR":
    case "ER_TABLE_EXISTS_ERROR":
    case "ER_BAD_TABLE_ERROR":
    case "ER_HANDSHAKE_ERROR":
      throw new InternalServerError(HTTPStatusCode.status.internalServerError);
  }
};
