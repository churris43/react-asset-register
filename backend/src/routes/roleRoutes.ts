import { Router } from "express";
import * as roleControllers from "../controllers/roleControllers";

const router = Router();

router.get("/", roleControllers.getRoles);
router.get("/:id", roleControllers.getRolesById);
router.delete("/:id", roleControllers.deleteRole);
router.post("/", roleControllers.createRole);
router.put("/:id", roleControllers.updateRole);

export default router;
