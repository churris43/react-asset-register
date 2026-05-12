import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import RoleInterface from "@/src/interfaces/role";

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
