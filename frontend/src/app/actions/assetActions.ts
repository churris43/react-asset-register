"use server";

import { revalidatePath } from "next/cache";
import AssetInterface from "@/src/interfaces/asset";
import { fetchWithAuth } from "@/src/libs/fetchWithAuth";

const path: string = "/assets";

export async function deleteAsset(id: number) {
  try {
    const res = await fetchWithAuth(`/assets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete asset" };
  }
}

export async function getAssets() {
  try {
    const response = await fetchWithAuth(`/assets`);
    if (!response.ok) {
      throw new Error("Failed to get asset");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAsset(id: number) {
  try {
    const response = await fetchWithAuth(`/assets/${id}`);
    if (!response.ok) {
      throw new Error("Failed to get asset");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function editAsset(id: number, data: AssetInterface) {
  try {
    const res = await fetchWithAuth(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to edit the asset");
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

export async function createAsset(data: AssetInterface) {
  try {
    const res = await fetchWithAuth(`/assets/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to create the asset");
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
export default deleteAsset;
