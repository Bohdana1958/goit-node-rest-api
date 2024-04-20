import { Router } from "express";

import {
  checkLoginData,
  checkRegisterData,
  protect,
} from "../middelwares/authMiddelwares.js";
import {
  getAllUsers,
  getCurrent,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";

const router = Router();

router.get("/", protect, getAllUsers);

router.get("/current", protect, getCurrent);

router.post("/register", checkRegisterData, register);

router.post("/login", checkLoginData, login);

router.post("/logout", protect, logout);

export default router;
