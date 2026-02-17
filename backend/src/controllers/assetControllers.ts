import { Request, Response } from "express";
import * as AssetServices from "../services/AssetServices";
import Asset from "../types/Asset";

export const getAssetsById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const Asset = await AssetServices.getAssetsById(Number(req.params.id));
    if (!Asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    return res.status(200).json(Asset);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch asset" });
  }
};

export const deleteAsset = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const Asset = await AssetServices.deleteAsset(Number(req.params.id));
    return res.status(200).json({ message: "Asset deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete asset" });
  }
};

export const getAssets = async (req: Request, res: Response) => {
  try {
    const Asset = await AssetServices.getAssets();
    res.status(200).json(Asset);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch asset" });
  }
};

export const createAsset = async (
  req: Request<{ Asset: Asset }>,
  res: Response,
) => {
  try {
    const Asset = await AssetServices.createAsset(req.body);
    return res.status(201).json({ message: "Asset created" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create asset" });
  }
};

export const updateAsset = async (
  req: Request<{ id: string; Asset: Asset }>,
  res: Response,
) => {
  try {
    const Asset = await AssetServices.updateAsset(
      Number(req.params.id),
      req.body,
    );
    return res.status(200).json({ message: "Asset updated" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update asset" });
  }
};

export default getAssetsById;
