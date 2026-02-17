import { Router } from "express";
import * as assetControllers from "../controllers/assetControllers";

const router = Router();

router.get("/", assetControllers.getAssets);
router.get("/:id", assetControllers.getAssetsById);
router.delete("/:id", assetControllers.deleteAsset);
router.post("/", assetControllers.createAsset);
router.put("/:id", assetControllers.updateAsset);

export default router;
