import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import AssetTypeInterface from "@/src/interfaces/assetType";

export async function getAssetTypes(): Promise<AssetTypeInterface[] | []> {
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
