import { Router } from "express";
import { checkRegisterData } from "../middelwares/authMiddelwares.js";
import { register } from "../controllers/userControllers.js";

const router = Router();

router.post("/register", checkRegisterData, register);

router.post("/login");

export default router;
