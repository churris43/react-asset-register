import Asset from "../types/Asset";
import { assetModel } from "../generated/prisma/models/asset";
import { prisma } from "../lib/prisma";

export const getAssets = async (): Promise<assetModel[]> => {
  return prisma.asset.findMany();
};

export const getAssetsById = async (id: number): Promise<assetModel | null> => {
  return prisma.asset.findUnique({
    where: { id },
  });
};

export const deleteAsset = async (id: number): Promise<assetModel> => {
  return prisma.asset.delete({
    where: { id },
  });
};

export const createAsset = async (asset: Asset): Promise<assetModel> => {
  return prisma.asset.create({
    data: {
      asset_name: asset.asset_name,
      role_id: asset.role_id ? Number(asset.role_id) : null,
      asset_type_id: asset.asset_type_id ? Number(asset.asset_type_id) : null,
    },
  });
};

export const updateAsset = async (
  id: number,
  asset: Asset,
): Promise<assetModel> => {
  return prisma.asset.update({
    where: { id },
    data: {
      asset_name: asset.asset_name,
      role_id: asset.role_id ? Number(asset.role_id) : null,
      asset_type_id: asset.asset_type_id ? Number(asset.asset_type_id) : null,
    },
  });
};

export default getAssetsById;
