import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostModel } from "../models/post.model";
import {
  datetimeToUnix,
  sqlCallback,
  sqlQuery,
} from "../utils/functions.utill";

export const createPost = (req: Request, res: Response) => {
  try {
    const { title, body } = req.body as PostModel;
    const { id } = req.user;
    if (!title || !body) {
      return res.status(400).json({
        status: 400,
        message: "Bad request",
      });
    }
    const postId = uuidv4();
    const query = `INSERT INTO posts (id, user_id, title, body) VALUES ('${postId}', '${id}', "${title}", "${body}")`;
    sqlQuery(query);
    return res.status(200).json({
      status: 200,
      message: "Post created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: e,
    });
  }
};

export const getPosts = (req: Request, res: Response) => {
  try {
    const { limit, page } = req.query;
    if (!limit || !page) {
      return res.status(400).json({
        status: 400,
        message: "Missing query page or limit",
      });
    }
    let query = `SELECT p.id, p.title, p.body, p.created_at AS createdAt, pr.username, pr.user_id, pr.is_anonymous, pr.image AS profileImage, pi.image 
    FROM posts AS p 
    JOIN profiles AS pr ON (p.user_id = pr.user_id) 
    LEFT JOIN post_images AS pi ON (p.id = pi.post_id);`;
    sqlCallback(query, (result) => {
      const createdAt = datetimeToUnix(result[0].createdAt);
      return res.status(200).json({
        status: 200,
        data: result,
      });
    });
  } catch (e) {}
};

export const getPost = (req: Request, res: Response) => {
  try {
    return res.status(404).json({
      status: 404,
      message: "Not Found",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

export const updatePost = (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const deletePost = (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
