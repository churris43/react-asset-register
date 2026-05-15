import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import AssetInterface from "@/src/interfaces/asset";
import { PaginationQueryParams } from "@/src/interfaces/paginationQueryParams";

export async function getAssets(): Promise<AssetInterface[]> {
  try {
    const response = await fetchWithAuth(`/assets`);
    if (!response.ok) {
      throw new Error("Failed to get assets");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getPaginatedAssets(
  params: PaginationQueryParams = {},
): Promise<{ data: AssetInterface[]; total: number }> {
  const {
    page = 1,
    limit = 20,
    sortField = "asset_name",
    sortOrder = "asc",
    search = "",
  } = params;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortField,
    sortOrder,
  });
  if (search) qs.set("search", search);

  try {
    const response = await fetchWithAuth(`/assets?${qs}`);
    if (!response.ok) throw new Error("Failed to get assets");
    return response.json();
  } catch (error) {
    return { data: [], total: 0 };
  }
}
