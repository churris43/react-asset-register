import { Router } from "express";
import * as assetTypeControllers from "../controllers/assetTypeControllers";

const router = Router();

router.get("/", assetTypeControllers.getAssetTypes);
router.get("/:id", assetTypeControllers.getAssetTypesById);
router.delete("/:id", assetTypeControllers.deleteAssetType);
router.post("/", assetTypeControllers.createAssetType);
router.put("/:id", assetTypeControllers.updateAssetType);

export default router;
