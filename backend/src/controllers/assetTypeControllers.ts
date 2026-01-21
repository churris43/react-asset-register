import { Request, Response } from "express";
import * as assetTypeServices from "../services/assetTypeServices";
import AssetType from "../types/AssetTypes";

export const getAssetTypesById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const assetType = await assetTypeServices.getAssetTypesById(
      Number(req.params.id),
    );
    if (!assetType) {
      return res.status(404).json({ message: "Asset Type not found" });
    }
    return res.status(200).json(assetType);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch asset type" });
  }
};

export const deleteAssetType = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const assetType = await assetTypeServices.deleteAssetType(
      Number(req.params.id),
    );
    return res.status(200).json({ message: "Asset Type deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete asset type" });
  }
};

export const getAssetTypes = async (req: Request, res: Response) => {
  try {
    const assetType = await assetTypeServices.getAssetTypes();
    res.status(200).json(assetType);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch asset type" });
  }
};

export const createAssetType = async (
  req: Request<{ assetType: AssetType }>,
  res: Response,
) => {
  try {
    const assetType = await assetTypeServices.createAssetType(req.body);
    return res.status(201).json({ message: "Asset Type created" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create asset type" });
  }
};

export const updateAssetType = async (
  req: Request<{ id: string; assetType: AssetType }>,
  res: Response,
) => {
  try {
    const assetType = await assetTypeServices.updateAssetType(
      Number(req.params.id),
      req.body,
    );
    return res.status(200).json({ message: "Asset Type updated" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update asset type" });
  }
};

export default getAssetTypesById;
