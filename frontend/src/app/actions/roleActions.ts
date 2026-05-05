"use server";

import { revalidatePath } from "next/cache";
import RoleInterface from "@/src/interfaces/role";

const path: string = "/roles";
const API_BASE = process.env.API_URL;

export async function deleteRole(id: number) {
  try {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
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
    return { success: false, error: "Failed to create role" };
  }
}

export async function getRoles(): Promise<RoleInterface[] | []> {
  try {
    // @todo: Need to work out how to proxy this, this request comes fro the server
    const response = await fetch(`${API_BASE}/roles`);
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
    const response = await fetch(`${API_BASE}/roles/${id}`);
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
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: "PUT",
      // todo: refactor to get the headers in utils
      headers: {
        "Content-Type": "application/json",
      },
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
    const res = await fetch(`${API_BASE}/roles/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
