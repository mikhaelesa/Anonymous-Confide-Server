import { Router } from "express";
import { renewAccessToken } from "../controllers/token.controller";

const router = Router();

router.post("/", renewAccessToken);

export default router;
