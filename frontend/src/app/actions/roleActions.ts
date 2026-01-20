"use server";

import { revalidatePath } from "next/cache";
import RoleInterface from "@/src/interfaces/role";

export async function deleteRole(id: number) {
  const res = await fetch("http://api:3000/roles/" + id, {
    method: "DELETE",
    headers: {
      // todo: use the utils constant
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  revalidatePath("/roles");
}

export async function getRoles() {
  try {
    // @todo: Need to work out how to proxy this, this request comes fro the server
    const response = await fetch("http://api:3000/roles");
    if (!response.ok) {
      throw new Error("Failed to get role");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
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

export async function editRole(id: number, data: RoleInterface) {
  const res = await fetch("http://api:3000/roles/" + id, {
    method: "PUT",
    // todo: refactor to get the headers in utils
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to edit the role");
  revalidatePath("/roles");
}

export async function createRole(data: RoleInterface) {
  const res = await fetch("http://api:3000/roles/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create role");
  revalidatePath("/roles");
}
export default deleteRole;
