import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import RoleInterface from "@/src/interfaces/role";
import { PaginationQueryParams } from "@/src/interfaces/paginationQueryParams";

export async function getRoles(): Promise<RoleInterface[] | []> {
  try {
    const response = await fetchWithAuth(`/roles`);
    if (!response.ok) {
      throw new Error("Failed to get roles");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getPaginatedRoles(
  params: PaginationQueryParams = {},
): Promise<{ data: RoleInterface[]; total: number }> {
  const {
    page = 1,
    limit = 20,
    sortField = "role_name",
    sortOrder = "asc",
  } = params;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortField,
    sortOrder,
  });

  try {
    const response = await fetchWithAuth(`/roles?${qs}`);
    if (!response.ok) throw new Error("Failed to get roles");
    return response.json();
  } catch (error) {
    return { data: [], total: 0 };
  }
}
