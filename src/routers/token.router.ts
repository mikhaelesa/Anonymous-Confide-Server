import express from "express";
import { renewAccessToken } from "../controllers/token.controller";

const router = express.Router();

router.post("/", renewAccessToken);

export default router;
