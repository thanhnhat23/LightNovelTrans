import express from "express";
import {
  getPublicProfile,
  checkUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();
router.get("/checkUsers", checkUsers);
router.get("/:nameTag", getPublicProfile);
router.delete("/deleteUsers", deleteUser);

export default router;
