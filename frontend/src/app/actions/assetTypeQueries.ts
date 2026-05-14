import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import AssetTypeInterface from "@/src/interfaces/assetType";
import { PaginationQueryParams } from "@/src/interfaces/paginationQueryParams";

export async function getAssetTypes(): Promise<AssetTypeInterface[]> {
  try {
    const response = await fetchWithAuth(`/assettypes`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getPaginatedAssetTypes(
  params: PaginationQueryParams = {},
): Promise<{ data: AssetTypeInterface[]; total: number }> {
  const {
    page = 1,
    limit = 20,
    sortField = "asset_type_name",
    sortOrder = "asc",
  } = params;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortField,
    sortOrder,
  });

  try {
    const response = await fetchWithAuth(`/assettypes?${qs}`);
    if (!response.ok) throw new Error("Failed to get asset types");
    return response.json();
  } catch (error) {
    return { data: [], total: 0 };
  }
}
