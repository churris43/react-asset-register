"use server";

import UserInterface from "@/src/interfaces/user";
import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import { revalidatePath } from "next/cache";

const path: string = "/users";

export async function createUser(data: UserInterface) {
  try {
    const res = await fetchWithAuth(`${path}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Validation error
    if (res.status === 422) {
      const body = await res.json();
      return { success: false, fieldErrors: body.fieldErrors };
    }

    if (!res.ok) {
      throw new Error("Failed to create user");
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

export async function deleteUser(id: number) {
  try {
    const res = await fetchWithAuth(`${path}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    // 'page' invalidates all cached variants of this route (e.g. ?page=2&sortField=role_name)
    revalidatePath(path, "page");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function editUser(id: number, data: UserInterface) {
  try {
    const res = await fetchWithAuth(`${path}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Validation error
    if (res.status === 422) {
      const body = await res.json();
      return { success: false, fieldErrors: body.fieldErrors };
    }

    if (!res.ok) {
      throw new Error("Failed to edit the user");
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
