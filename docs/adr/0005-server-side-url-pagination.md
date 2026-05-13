# ADR 0005: Server-Side URL-Based Pagination

- **Date:** 2026-05-13
- **Status:** Accepted

---

## Context

List pages (roles, assets) need pagination to avoid loading unbounded record sets. Three approaches were considered:

1. **Client-side pagination** — fetch all records, slice in the browser. Simple but does not scale and wastes bandwidth.
2. **State-based pagination** — React `useState` to track the current page, fetch on change. Requires a client component and loses the current page on browser refresh.
3. **URL-based server pagination** — page number and sort parameters live in the URL query string; the Next.js server component reads them and fetches only the required slice from the backend.

Option 3 was chosen because it is idiomatic for the Next.js App Router, keeps list pages as server components (no extra client-side JavaScript), and makes pagination state bookmarkable and shareable by default.

---

## Decision

Pagination is implemented end-to-end across three layers: the Express backend, the Next.js server actions, and the page component.

---

## Backend

### Service layer

Each paginated resource has two service functions:

- `getAll()` — returns all records as a flat array. Used for dropdown option lists where the full set is needed.
- `getPaginatedX(page, limit, sortField, sortOrder)` — returns `{ data, total }` using a `Promise.all` to run the data query and the count query concurrently.

```typescript
const [data, total] = await Promise.all([
  prisma.resource.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortField]: sortOrder },
  }),
  prisma.resource.count(),
]);
return { data, total };
```

### Controller layer

A single `GET /` route handles both use cases. The controller branches on the presence of the `page` query parameter:

- **`page` absent** → calls `getAll()`, returns a flat array (used by dropdowns).
- **`page` present** → calls `getPaginatedX()`, returns `{ data, total }`.

Query parameter parsing is centralised in `backend/src/utils/parsePaginationParams.ts` and reused by every paginated controller:

```typescript
const { page, limit, sortField, sortOrder } = parsePaginationParams(
  req.query,
  ALLOWED_SORT_FIELDS,
  "default_field_name",
);
```

`parsePaginationParams` applies the following rules:

| Parameter | Validation | Default |
|---|---|---|
| `page` | `Math.max(1, parseInt(...) \|\| 1)` | `1` |
| `limit` | `Math.max(1, Math.min(100, parseInt(...) \|\| 20))` | `20` |
| `sortField` | Must be in `ALLOWED_SORT_FIELDS` whitelist | resource-specific default |
| `sortOrder` | `"asc"` or `"desc"` | `"asc"` |

The `ALLOWED_SORT_FIELDS` whitelist prevents arbitrary Prisma field names from being injected via the query string.

### Changing the maximum records per request

The hard cap of **100** is set in `parsePaginationParams`:

```typescript
const limit = Math.max(1, Math.min(100, parseInt(query.limit as string) || 20));
//                              ^^^
//                         change this value
```

---

## Frontend

### Query action layer

Each resource has a `getPaginatedX(params)` function in `frontend/src/app/actions/`. It accepts a `PaginationQueryParams` object (defined in `frontend/src/interfaces/paginationQueryParams.ts`), builds a query string, and calls the backend:

```typescript
const qs = new URLSearchParams({
  page: String(page),
  limit: String(limit),
  sortField,
  sortOrder,
});
const response = await fetchWithAuth(`/resource?${qs}`);
```

### Changing the page size

The page size (`LIMIT`) is a constant at the top of each page component:

```typescript
// frontend/src/app/roles/page.tsx
const LIMIT = 20;
```

This value is passed to `getPaginatedX` as `limit` and determines how many rows are fetched per page. Change it here to adjust the page size for a specific list.

### Page component

Each list page is a Next.js async server component that accepts `searchParams` as a prop. Next.js 15+ passes `searchParams` as a `Promise`, so it must be awaited:

```typescript
async function Roles({
  searchParams,
}: {
  searchParams: Promise<PaginationSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const sortField = params.sortField ?? "resource_name";
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc";

  const { data: records, total } = await getPaginatedX({ page, limit: LIMIT, sortField, sortOrder });
  const totalPages = Math.ceil(total / LIMIT);
  ...
}
```

`PaginationSearchParams` (in `frontend/src/interfaces/paginationSearchParams.ts`) defines the expected URL parameters:

```typescript
export interface PaginationSearchParams {
  page?: string;
  sortField?: string;
  sortOrder?: string;
}
```

### PaginationNav component

`frontend/src/components/ui/PaginationNav.tsx` is a reusable server component that renders previous/next arrows and numbered page buttons. It renders nothing when `totalPages <= 1`.

Navigation links are built by `buildHref` (`frontend/src/utils/url.ts`), which merges the current `searchParams` with a `page` override so that other active parameters (e.g. `sortField`) are preserved across page changes:

```typescript
href={buildHref(searchParams, { page: String(currentPage + 1) })}
```

### Cache invalidation

Server actions (create, edit, delete) call `revalidatePath(path, "page")` rather than `revalidatePath(path)`. The `"page"` scope invalidates all cached variants of the route, including every `?page=N&sortField=...` combination, so the list reflects mutations immediately regardless of which page the user is on.

---

## Query string format

A paginated request looks like:

```
GET /roles?page=2&limit=20&sortField=role_name&sortOrder=asc
```

| Parameter | Type | Description |
|---|---|---|
| `page` | integer ≥ 1 | Page number to fetch |
| `limit` | integer 1–100 | Records per page |
| `sortField` | string | Field to sort by (whitelisted per resource) |
| `sortOrder` | `asc` \| `desc` | Sort direction |

A request without `page` (e.g. `GET /roles`) returns all records as a flat array and is used exclusively for dropdown population.

---

## Applying pagination to a new resource

1. **Service** — add `getPaginatedX(page, limit, sortField, sortOrder)` alongside the existing `getAll()`.
2. **Controller** — add `ALLOWED_SORT_FIELDS`, branch on `typeof req.query.page === "string"`, call `parsePaginationParams`.
3. **Query action** — add `getPaginatedX(params: PaginationQueryParams)` to the resource's query file.
4. **Server actions** — change `revalidatePath(path)` to `revalidatePath(path, "page")`.
5. **Page component** — accept `searchParams: Promise<PaginationSearchParams>`, parse params, call `getPaginatedX`, compute `totalPages`, render `<PaginationNav>`.