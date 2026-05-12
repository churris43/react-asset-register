import { Router } from "express";
import roleRoutes from "./roleRoutes";
import assetTypeRoutes from "./assetTypeRoutes";
import assetRoutes from "./assetRoutes";
import authRoutes from "./authRoutes";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", authenticate, roleRoutes);
router.use("/assettypes", authenticate, assetTypeRoutes);
router.use("/assets", authenticate, assetRoutes);

export default router;
