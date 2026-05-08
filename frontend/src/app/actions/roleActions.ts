"use server";

import { revalidatePath } from "next/cache";
import RoleInterface from "@/src/interfaces/role";
import { fetchWithAuth } from "@/src/libs/fetchWithAuth";

const path: string = "/roles";

export async function deleteRole(id: number) {
  try {
    const res = await fetchWithAuth(`/roles/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create role" };
  }
}

export async function getRoles(): Promise<RoleInterface[] | []> {
  try {
    const response = await fetchWithAuth(`/roles`);
    if (!response.ok) {
      throw new Error("Failed to get role");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getRole(id: number) {
  try {
    const response = await fetchWithAuth(`/roles/${id}`);
    if (!response.ok) {
      throw new Error("Failed to get role");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function editRole(id: number, data: RoleInterface) {
  try {
    const res = await fetchWithAuth(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to edit the role");
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

export async function createRole(data: RoleInterface) {
  try {
    const res = await fetchWithAuth(`/roles/`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create role");
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
export default deleteRole;
