import express from "express";
import { getProfile } from "../controllers/profile.controller";
import { authenticateToken } from "../middlewares/authenticateToken.middleware";

const router = express.Router();

router.get("/", authenticateToken, getProfile);

export default router;
