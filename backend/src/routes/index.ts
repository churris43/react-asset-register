import { Router } from "express";
import roleRoutes from "./roleRoutes";

const router = Router();

console.log("indexRouter here");
router.use("/roles", roleRoutes);

export default router;
