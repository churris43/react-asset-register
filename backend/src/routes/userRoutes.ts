import { Router } from "express";
import * as userControllers from "../controllers/userControllers";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";

const router = Router();

router.get("/", userControllers.getUsers);
router.post("/", validate(createUserSchema), userControllers.createUser);
router.delete("/:id", userControllers.deleteUser);
router.put("/:id", validate(updateUserSchema), userControllers.updateUser);

export default router;
