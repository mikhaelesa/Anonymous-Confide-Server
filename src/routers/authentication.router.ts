import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authentication.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);

export default router;
