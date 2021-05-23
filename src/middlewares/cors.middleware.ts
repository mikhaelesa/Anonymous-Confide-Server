import { NextFunction, Request, Response } from "express";
import { ICors } from "../utils/interfaces.util";

const defaultCorsOptions: ICors = {
  origins: "*",
  allowedHeaders: "Vary",
  methods: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
};

export default (options: ICors = defaultCorsOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", options.origins);
    res.setHeader("Access-Control-Allow-Methods", options.methods);
    res.setHeader("Access-Control-Allow-Headers", options.allowedHeaders);
    next();
  };
};
