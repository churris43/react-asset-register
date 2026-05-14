import Asset from "../types/Asset";
import { assetModel, assetGetPayload } from "../generated/prisma/models/asset";
import { prisma } from "../lib/prisma";

// Typed result for queries that include role and asset_type via Prisma's include.
// assetGetPayload derives the exact shape from the query args, staying correct if the schema changes.
type AssetWithRelations = assetGetPayload<{
  include: { role: true; asset_type: true };
}>;
import { buildOrderBy, NestedOrderBy } from "../utils/buildOrderBy";

// Direct fields (e.g. asset_name) fall back to { asset_name: "asc" } in buildOrderBy.
// Relation fields need an entry here, e.g.:
//   buildOrderBy("asset_type_name", "asc", NESTED_SORT_FIELDS)
//   → { asset_type: { asset_type_name: "asc" } }
const NESTED_SORT_FIELDS: Record<string, NestedOrderBy> = {
  asset_type_name: (order) => ({ asset_type: { asset_type_name: order } }),
  role_name: (order) => ({ role: { role_name: order } }),
};

export const getAssets = async (): Promise<AssetWithRelations[]> => {
  return prisma.asset.findMany({
    include: {
      role: true,
      asset_type: true,
    },
    orderBy: {
      asset_name: "asc",
    },
  });
};

export const getPaginatedAssets = async (
  page: number,
  limit: number,
  sortField: string,
  sortOrder: "asc" | "desc",
): Promise<{ data: AssetWithRelations[]; total: number }> => {
  const [data, total] = await Promise.all([
    prisma.asset.findMany({
      include: {
        role: true,
        asset_type: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: buildOrderBy(sortField, sortOrder, NESTED_SORT_FIELDS),
    }),
    prisma.asset.count(),
  ]);

  return { data, total };
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

export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<assetModel> => {
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
  asset: Omit<Asset, 'id'>,
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
