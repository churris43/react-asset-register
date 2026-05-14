import { Request, Response } from "express";
import * as assetTypeServices from "../services/assetTypeServices";
import AssetType from "../types/AssetTypes";
import { parsePaginationParams } from "../utils/parsePaginationParams";

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

const ALLOWED_SORT_FIELDS = ["asset_type_name"] as const;

export const getAssetTypes = async (req: Request, res: Response) => {
  try {
    if (typeof req.query.page === "string") {
      const { page, limit, sortField, sortOrder } = parsePaginationParams(
        req.query,
        ALLOWED_SORT_FIELDS,
        "asset_type_name",
      );
      const assetTypes = await assetTypeServices.getPaginatedAssetTypes(
        page,
        limit,
        sortField,
        sortOrder,
      );
      return res.status(200).json(assetTypes);
    } else {
      const assetTypes = await assetTypeServices.getAssetTypes();
      return res.status(200).json(assetTypes);
    }
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
