import { Router } from "express";
import * as userControllers from "../controllers/userControllers";

const router = Router();

router.get("/", userControllers.getUsers);
router.delete("/:id", userControllers.deleteUser);
router.put("/:id", userControllers.updateUser);

export default router;
