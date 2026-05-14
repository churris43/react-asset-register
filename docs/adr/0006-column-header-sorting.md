# ADR 0006: Column Header Sorting

- **Date:** 2026-05-14
- **Status:** Accepted

---

## Context

List pages needed a way to sort records by column. Two approaches were considered:

1. **Client-side sorting** — fetch all records and re-order in the browser. Does not scale and is inconsistent with the server-side pagination already in place (ADR 0005).
2. **URL-based server sorting** — sort parameters live in the URL query string alongside pagination parameters. Clicking a column header generates a new URL; the Next.js server component reads it and passes `sortField` and `sortOrder` to the paginated backend query.

Option 2 was chosen for consistency with the pagination model, and because it keeps list pages as server components with no additional client-side JavaScript.

---

## Decision

Sorting is implemented as clickable column headers. The current sort state lives in the URL and is read by the page component on every request.

---

## New components and files

### `Heading` interface — `frontend/src/interfaces/heading.ts`

A typed object that carries the column label and an optional sort field name:

```typescript
interface Heading {
  label: string;
  sortField?: string; // omit for non-sortable columns
}
```

### `HeadingSortButton` — `frontend/src/components/ui/HeadingSortButton.tsx`

A server component rendered inside each sortable column header. It receives the column's `sortField`, the active `currentSortField`, the active `currentSortOrder`, and the current `searchParams`. It computes whether it is the active sort column and builds a `<Link>` using `buildHref` that preserves all other active URL parameters:

```typescript
const isActive = sortField === currentSortField;
const linkOrder = isActive && currentSortOrder === "desc" ? "asc" : "desc";
```

The arrow icon reflects the **current** sort direction (not the next direction), so the user can see how the data is currently ordered at a glance:

- Active column sorted ascending → up arrow
- Active column sorted descending → down arrow
- Inactive column → up arrow (preview of what clicking will do)

### `TableHeading` — `frontend/src/components/ui/TableHeading.tsx`

Updated to accept `headings: Heading[]` and optional sort props (`currentSortField`, `currentSortOrder`, `searchParams`). Renders a `<HeadingSortButton>` next to the label for any heading that has a `sortField` defined. Sort props are optional so that `TableHeading` can be used without sorting.

### `buildOrderBy` utility — `backend/src/utils/buildOrderBy.ts`

A backend utility that produces the correct Prisma `orderBy` object. Required because relation fields cannot use the flat `{ [sortField]: sortOrder }` shorthand — Prisma requires a nested object for those:

```typescript
// Direct field:   { asset_name: "asc" }
// Relation field: { asset_type: { asset_type_name: "asc" } }
```

`buildOrderBy(sortField, sortOrder, nestedFields)` falls back to the flat shorthand for direct columns and delegates to the `nestedFields` map for relation fields.

---

## Sorting from related tables

When sorting by a field that belongs to a related model (e.g. sorting assets by `asset_type_name` or `role_name`), the service layer declares a `NESTED_SORT_FIELDS` map:

```typescript
const NESTED_SORT_FIELDS: Record<string, NestedOrderBy> = {
  asset_type_name: (order) => ({ asset_type: { asset_type_name: order } }),
  role_name:       (order) => ({ role: { role_name: order } }),
};
```

`buildOrderBy` checks this map before falling back to the flat form:

```typescript
orderBy: buildOrderBy(sortField, sortOrder, NESTED_SORT_FIELDS)
```

Resources whose sortable fields are all direct columns (roles, asset types) do not need a `NESTED_SORT_FIELDS` map and do not use `buildOrderBy`.

---

## Limitations

- **Single-field sort only.** Only one `sortField` and one `sortOrder` are carried in the URL at a time. Multi-column sorting is not supported.
- **Clicking a sort header resets to page 1.** `HeadingSortButton` always passes `page: "1"` as an override to `buildHref`. This prevents showing a non-existent page when the new sort order changes the total number of pages or reorders the result set significantly.
- **Sort direction is not validated on the frontend.** The frontend page components accept any `sortOrder` value from the URL and normalise it to `"asc"` unless it is exactly `"desc"`. The backend applies the same normalisation independently inside `parsePaginationParams`.
- **Sorting only works on paginated tables.** The sort parameters are read from the URL by the page component and forwarded to `getPaginatedX`. Non-paginated queries (`getAll`) do not accept sort parameters — they always return records in a fixed default order.

---

## Applying sorting to a new column

### Sortable direct column (e.g. `role_name` on the roles page)

1. **Backend controller** — add the field name to `ALLOWED_SORT_FIELDS`.
2. **Frontend page** — add `sortField: "field_name"` to the relevant `Heading` object in the `headings` array.

No service changes are needed; the existing `orderBy: { [sortField]: sortOrder }` handles it automatically.

### Sortable relation column (e.g. `asset_type_name` on the assets page)

1. **Backend service** — add an entry to `NESTED_SORT_FIELDS`:
   ```typescript
   relation_field: (order) => ({ relation: { relation_field: order } }),
   ```
2. **Backend controller** — add the field name to `ALLOWED_SORT_FIELDS`.
3. **Frontend page** — add `sortField: "relation_field"` to the relevant `Heading` object.

### Non-sortable column

Leave `sortField` out of the `Heading` object. `TableHeading` will render the label only, with no sort button.