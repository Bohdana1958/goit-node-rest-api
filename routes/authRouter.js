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
  updateAvatar,
  verificationToken,
  verify,
} from "../controllers/userControllers.js";
import validateBody from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/usersSchema.js";
import { multerUpload } from "../middelwares/userMiddelware.js";

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

router.patch("/avatars", protect, multerUpload, updateAvatar);

router.get("/verify/:verificationToken", verificationToken);

router.post("/verify", verify);

export default router;
