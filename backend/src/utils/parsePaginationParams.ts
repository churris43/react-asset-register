import { ParsedQs } from "qs";

// Parses page, limit, sortField, and sortOrder from an Express query string,
// applying bounds and whitelisting sortField against allowedSortFields.
export function parsePaginationParams(
  query: ParsedQs,
  allowedSortFields: readonly string[],
  defaultSortField: string,
): {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  search?: string;
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(query.limit as string) || 20),
  );
  const sortField = allowedSortFields.includes(query.sortField as string)
    ? (query.sortField as string)
    : defaultSortField;
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";
  const search = typeof query.search === "string" ? query.search : undefined;
  return { page, limit, sortField, sortOrder, search };
}
