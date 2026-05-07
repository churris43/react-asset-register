import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authControllers";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // time window in milliseconds — 5 minutes
  max: 10, // max requests allowed per IP within the window
  message: { message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
