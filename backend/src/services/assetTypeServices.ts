import AssetType from "../types/AssetTypes";
import { asset_typeModel } from "../generated/prisma/models/asset_type";
import { prisma } from "../lib/prisma";

export const getAssetTypes = async (): Promise<asset_typeModel[]> => {
  return prisma.asset_type.findMany({
    orderBy: {
      asset_type_name: "asc",
    },
  });
};

export const getPaginatedAssetTypes = async (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: "asc" | "desc",
): Promise<{ data: asset_typeModel[]; total: number }> => {
  const [data, total] = await Promise.all([
    prisma.asset_type.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortField]: sortOrder },
    }),
    prisma.asset_type.count(),
  ]);

  return { data, total };
};

export const getAssetTypesById = async (
  id: number,
): Promise<asset_typeModel | null> => {
  return prisma.asset_type.findUnique({
    where: { id },
  });
};

export const deleteAssetType = async (id: number): Promise<asset_typeModel> => {
  return prisma.asset_type.delete({
    where: { id },
  });
};

export const createAssetType = async (
  asset_type: Omit<AssetType, 'id'>,
): Promise<asset_typeModel> => {
  return prisma.asset_type.create({
    data: {
      asset_type_name: asset_type.asset_type_name,
    },
  });
};

export const updateAssetType = async (
  id: number,
  asset_type: Omit<AssetType, 'id'>,
): Promise<asset_typeModel> => {
  return prisma.asset_type.update({
    where: { id },
    data: {
      asset_type_name: asset_type.asset_type_name,
    },
  });
};

export default getAssetTypesById;
