import { fetchWithAuth } from "@/src/libs/fetchWithAuth";
import UserInterface from "@/src/interfaces/user";
import { PaginationQueryParams } from "@/src/interfaces/paginationQueryParams";

export async function getPaginatedUsers(
  params: PaginationQueryParams = {},
): Promise<{ data: UserInterface[]; total: number }> {
  const {
    page = 1,
    limit = 20,
    sortField = "email",
    sortOrder = "asc",
  } = params;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortField,
    sortOrder,
  });

  try {
    const response = await fetchWithAuth(`/users?${qs}`);
    if (!response.ok) throw new Error("Failed to get users");
    return response.json();
  } catch (error) {
    return { data: [], total: 0 };
  }
}

export async function getCurrentUser(): Promise<UserInterface | null> {
  try {
    const response = await fetchWithAuth("/auth/me");
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
