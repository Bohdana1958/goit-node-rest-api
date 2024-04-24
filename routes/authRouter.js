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
import validateBody from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchema.js";

const router = Router();

router.get("/", protect, getAllUsers);

router.get("/current", protect, getCurrent);

router.post(
  "/register",
  checkRegisterData,
  validateBody(registerUserSchema),
  register
);

router.post("/login", checkLoginData, validateBody(loginUserSchema), login);

router.post("/logout", protect, logout);

export default router;
