"use server";

import { revalidatePath } from "next/cache";
import AssetTypeInterface from "@/src/interfaces/assetType";

const path: string = "/assetTypes";
const API_BASE = process.env.API_URL;

export async function deleteAssetType(id: number) {
  try {
    const response = await fetch(`${API_BASE}/assettypes/${id}`, {
      method: "DELETE",
      headers: {
        // todo: use the utils constant
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete asset type" };
  }
}

export async function getAssetTypes(): Promise<AssetTypeInterface[] | []> {
  try {
    // @todo: Need to work out how to proxy this, this request comes fro the server
    const response = await fetch(`${API_BASE}/assettypes`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getAssetType(id: number) {
  try {
    const response = await fetch(`${API_BASE}/assettypes/${id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function editAssetType(id: number, data: AssetTypeInterface) {
  try {
    const response = await fetch(`${API_BASE}/assettypes/${id}`, {
      method: "PUT",
      // todo: refactor to get the headers in utils
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath(path);
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
    const response = await fetch(`${API_BASE}/assettypes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export default deleteAssetType;
