import { IUser } from "../../src/utils/interfaces.util";

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}
