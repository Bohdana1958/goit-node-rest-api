import { Router } from "express";
import {
  checkLoginData,
  checkRegisterData,
} from "../middelwares/authMiddelwares.js";
import { login, register } from "../controllers/userControllers.js";

const router = Router();

//router.post("/register",checkRegisterData, register)
router.post("/register", register);

router.post("/login", checkLoginData, login);

export default router;
