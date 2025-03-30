import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  updateInfo,
  checkAuth,
  updateBackground,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-background", protectRoute, updateBackground);
router.put("/update-info", protectRoute, updateInfo);
router.get("/check", protectRoute, checkAuth);

export default router;
