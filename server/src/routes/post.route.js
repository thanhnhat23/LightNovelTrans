import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPosts,
  createPost,
  getPostById,
  createComments,
  getComments,
  createChapter,
  getChapters,
  deleteChapter,
} from "../controllers/post.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/:id/chapter/:chapterId", getChapters);
router.post("/", protectRoute, createPost);
router.post(
  "/:id/chapters",
  upload.single("chapterFile"),
  protectRoute,
  createChapter
);
router.post("/:id/chapter/:chapterId/comment", protectRoute, createComments);
router.get("/:id/chapter/:chapterId/comment", protectRoute, getComments);
router.delete("/:id/chapter/:chapterId", protectRoute, deleteChapter);

export default router;
