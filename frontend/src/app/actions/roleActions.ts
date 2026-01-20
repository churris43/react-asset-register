"use server";

import { revalidatePath } from "next/cache";
import RoleInterface from "@/src/interfaces/role";

export async function deleteRole(id: number) {
  const res = await fetch("http://api:3000/roles/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  revalidatePath("/roles"); // Adjust path to match your route
}

export async function getRole(id: number) {
  try {
    const response = await fetch("http://api:3000/roles/" + id);
    if (!response.ok) {
      throw new Error("Failed to get role");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default deleteRole;
