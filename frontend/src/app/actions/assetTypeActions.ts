"use server";

import { revalidatePath } from "next/cache";
import AssetTypeInterface from "@/src/interfaces/assetType";
import { fetchWithAuth } from "@/src/libs/fetchWithAuth";

const path: string = "/assetTypes";

export async function deleteAssetType(id: number) {
  try {
    const response = await fetchWithAuth(`/assettypes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(response.statusText);
    revalidatePath(path, "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete asset type" };
  }
}

export async function editAssetType(id: number, data: AssetTypeInterface) {
  try {
    const response = await fetchWithAuth(`/assettypes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath(path, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createAssetType(data: AssetTypeInterface) {
  try {
    const response = await fetchWithAuth(`/assettypes/`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath(path, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export default deleteAssetType;
