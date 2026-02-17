import { Router } from "express";
import roleRoutes from "./roleRoutes";
import assetTypeRoutes from "./assetTypeRoutes";
import assetRoutes from "./assetRoutes";

const router = Router();

console.log("indexRouter here");
router.use("/roles", roleRoutes);
router.use("/assettypes", assetTypeRoutes);
router.use("/assets", assetRoutes);

export default router;
