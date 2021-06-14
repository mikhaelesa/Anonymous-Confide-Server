import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
} from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/authenticateToken.middleware";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", authenticateToken, createPost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
