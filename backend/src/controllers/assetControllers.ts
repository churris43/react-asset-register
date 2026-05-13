import { Request, Response } from "express";
import * as AssetServices from "../services/assetServices";
import Asset from "../types/Asset";
import { parsePaginationParams } from "../utils/parsePaginationParams";

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

const ALLOWED_SORT_FIELDS = ["asset_name"] as const;

export const getAssets = async (req: Request, res: Response) => {
  try {
    if (typeof req.query.page === "string") {
      const { page, limit, sortField, sortOrder } = parsePaginationParams(
        req.query,
        ALLOWED_SORT_FIELDS,
        "asset_name",
      );
      const assets = await AssetServices.getPaginatedAssets(
        page,
        limit,
        sortField,
        sortOrder,
      );
      return res.status(200).json(assets);
    } else {
      const assets = await AssetServices.getAssets();
      return res.status(200).json(assets);
    }
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
