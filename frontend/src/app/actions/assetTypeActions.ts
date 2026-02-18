"use server";

import { revalidatePath } from "next/cache";
import assetTypeInterface from "@/src/interfaces/assetType";

const path: string = "/assettypes";

export async function deleteAssetType(id: number) {
  try {
    const res = await fetch("http://api:3000/assettypes/" + id, {
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
    return { success: false, error: "Failed to delete asset type" };
  }
}

export async function getAssetTypes() {
  try {
    // @todo: Need to work out how to proxy this, this request comes fro the server
    const response = await fetch("http://api:3000/assettypes");
    if (!response.ok) {
      throw new Error("Failed to get asset type");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAssetType(id: number) {
  try {
    const response = await fetch("http://api:3000/assettypes/" + id);
    if (!response.ok) {
      throw new Error("Failed to get asset type");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function editAssetType(id: number, data: assetTypeInterface) {
  try {
    const res = await fetch("http://api:3000/assettypes/" + id, {
      method: "PUT",
      // todo: refactor to get the headers in utils
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to edit the asset type");
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create asset type" };
  }
}

export async function createAssetType(data: assetTypeInterface) {
  try {
    const res = await fetch("http://api:3000/assettypes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create asset type");
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  } finally {
    revalidatePath(path);
  }
}
export default deleteAssetType;
