"use server";

import { revalidatePath } from "next/cache";
import AssetInterface from "@/src/interfaces/asset";

const path: string = "/assets";
const API_BASE = process.env.API_URL;

export async function deleteAsset(id: number) {
  try {
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: "DELETE",
      headers: {
        // todo: use the utils constant
        "Content-Type": "application/json",
      },
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
    // @todo: Need to work out how to proxy this, this request comes fro the server
    const response = await fetch(`${API_BASE}/assets`);
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
    const response = await fetch(`${API_BASE}/assets/${id}`);
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
    const res = await fetch(`${API_BASE}/assets/${id}`, {
      method: "PUT",
      // todo: refactor to get the headers in utils
      headers: {
        "Content-Type": "application/json",
      },
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
    const res = await fetch(`${API_BASE}/assets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
