import { Router } from "express";
import rateLimit from "express-rate-limit";
import roleRoutes from "./roleRoutes";
import assetTypeRoutes from "./assetTypeRoutes";
import assetRoutes from "./assetRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import { authenticate } from "../middleware/authenticate";

const router = Router();

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100,
  message: { message: "Too many requests, please try again later" },
});

router.use("/auth", authRoutes);
router.use("/roles", authenticate, apiLimiter, roleRoutes);
router.use("/assettypes", authenticate, apiLimiter, assetTypeRoutes);
router.use("/assets", authenticate, apiLimiter, assetRoutes);
router.use("/users", authenticate, apiLimiter, userRoutes);

export default router;
