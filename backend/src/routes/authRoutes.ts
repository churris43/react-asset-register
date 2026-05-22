import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authControllers";
import { authLimiter } from "../utils/authLimiter";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/login", authLimiter, authController.login);
router.post("/refresh", authLimiter, authController.refresh);
router.get("/me", authLimiter, authenticate, authController.getMe);

export default router;
