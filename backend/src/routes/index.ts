import { Router } from "express";
import roleRoutes from "./roleRoutes";
import assetTypeRoutes from "./assetTypeRoutes";

const router = Router();

console.log("indexRouter here");
router.use("/roles", roleRoutes);
router.use("/assettypes", assetTypeRoutes);

export default router;
