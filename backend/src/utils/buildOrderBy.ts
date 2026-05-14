// A factory function that produces a Prisma orderBy object for a given sort field.
// Used for relation fields where Prisma requires nested syntax, e.g.:
//   { asset_type: { asset_type_name: "asc" } }
// instead of the flat shorthand { asset_type_name: "asc" } which only works on direct columns.
export type NestedOrderBy = (sortOrder: "asc" | "desc") => object;

// Builds the correct Prisma orderBy object for a given sortField and sortOrder.
// nestedFields maps relation sort fields to their NestedOrderBy factory.
// Falls back to { [sortField]: sortOrder } for direct (non-relation) columns.
export function buildOrderBy(
  sortField: string,
  sortOrder: "asc" | "desc",
  nestedFields: Record<string, NestedOrderBy> = {},
): object {
  if (sortField in nestedFields) {
    return nestedFields[sortField](sortOrder);
  }
  return { [sortField]: sortOrder };
}