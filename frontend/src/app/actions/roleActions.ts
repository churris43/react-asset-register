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

export default deleteRole;
