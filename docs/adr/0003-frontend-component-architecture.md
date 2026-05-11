# ADR 0003: Frontend Component Architecture

- **Date:** 2026-05-11
- **Status:** Accepted

---

## Context

This document explains how the frontend is structured for junior developers who are new to Next.js and React but understand general frontend framework concepts. It uses **assets** as the primary example — roles and asset types follow the exact same architecture.

---

## 1. Separation of Concerns: Why the Code Is Split the Way It Is

The codebase follows a layered architecture — each layer has a single responsibility:

| Layer | Files | Responsibility |
|---|---|---|
| **Data / Query** | `assetQueries.ts` | Fetch data from the API at page load |
| **Mutation** | `assetActions.ts` | Send create, edit, delete requests to the API |
| **Business / Interaction logic** | `useModalForm.ts`, `useDelete.ts` | Manage state, handle user interactions, call mutations |
| **Presentation** | `ModalForm.tsx`, `AddButton.tsx`, `TableRow.tsx`, etc. | Render UI, delegate logic to hooks |
| **Pure UI** | `SaveOrAddButton.tsx`, `CloseButton.tsx`, `InputHTML.tsx` | Reusable UI elements with no logic |

This separation means:

- A component file should not contain fetch logic or mutation calls directly.
- A query or action file should not contain any UI or state management.
- A hook owns the "what happens when the user does X" logic and keeps it out of the component.

If you find yourself writing `await editAsset(...)` inside a component, that is a sign the logic belongs in a hook. If you find a hook rendering JSX, that is a sign it should be a component.

---

## 2. The Big Picture: Server vs Client

Next.js App Router gives you two types of components. Understanding the difference is the foundation of everything else in this codebase.

### Server Components

- Run **only on the server** (Node.js), never in the browser.
- Can be `async` — they can `await` API requests directly.
- Cannot use React hooks (`useState`, `useEffect`, etc.).
- Cannot attach event listeners (`onClick`, `onChange`, etc.).
- The browser receives the final HTML — it never sees the component code.

### Client Components

- Marked with `"use client"` at the top of the file.
- Run **in the browser** after the initial page load.
- Can use hooks and handle user interactions.
- Are still rendered once on the server for the initial HTML (hydration), but their JavaScript is also sent to the browser.

### Why split them at all?

Keeping as much as possible on the server means less JavaScript sent to the browser, faster page loads, and simpler data fetching. Only the parts that genuinely need interactivity run in the browser.

### What runs where in this codebase

```
SERVER                                  CLIENT (browser)
──────────────────────────────────────  ────────────────────────────────────────
assets/page.tsx                         AddButton.tsx
  Fetches all data on page load           Opens the add modal

assetQueries.ts                         EditButton.tsx
  Plain async functions,                  Opens the edit modal
  called only from the server

assetActions.ts ("use server")          DeleteRecordButton.tsx
  Mutation endpoints — create,            Triggers delete with confirmation
  edit, delete. Called from
  client components as POST requests    GenericModal.tsx
                                          Renders the modal overlay

                                        ModalForm.tsx
                                          Renders the form inside the modal

                                        SaveOrAddButton.tsx / CloseButton.tsx
                                          Form action buttons

                                        useModalForm.ts (custom hook)
                                          Manages form state and submission

                                        useDelete.ts (custom hook)
                                          Manages delete confirmation and state
```

---

## 3. Component Tree

The diagram below shows how components are nested. Indentation means "is rendered inside".

```
assets/page.tsx  [SERVER]
│
│   Fetches: assets, roles, assetTypes
│   Defines: field config, column headings
│
├── TableHeading  [SERVER]
│     Renders column headers
│
├── TableRow  [SERVER]  (one per asset)
│   │
│   ├── <span> fields  [SERVER]
│   │     Renders asset_name, asset_type, role etc.
│   │
│   └── RowActionButtons  [CLIENT]
│       │
│       ├── EditButton  [CLIENT]
│       │   │   Owns: isModalOpen state
│       │   │
│       │   └── GenericModal  [CLIENT]
│       │       │   Shows/hides based on isModalOpen
│       │       │
│       │       └── ModalForm  [CLIENT]
│       │               Uses: useModalForm hook
│       │               Renders: fields, InputHTML, select
│       │               Renders: CloseButton, SaveOrAddButton
│       │
│       └── DeleteRecordButton  [CLIENT]
│               Uses: useDelete hook
│               Renders: DeleteButton (icon + disabled state)
│
├── TableFooter  [SERVER]
│     Renders row count / empty state message
│
└── AddButton  [CLIENT]
    │   Owns: isModalOpen state
    │
    └── GenericModal  [CLIENT]
        │
        └── ModalForm  [CLIENT]
                Uses: useModalForm hook
```

### Key boundary rule

The line between Server and Client is a **one-way door**. A Server Component can render a Client Component, but a Client Component cannot render a Server Component directly. Once you cross into Client territory, all children are also client-side.

This is why `assets/page.tsx` (Server) can render `AddButton` (Client), but `AddButton` cannot call `getAssets()` — that function uses server-only APIs.

---

## 4. Flow: Loading the Assets Page

This is the first thing that happens when a user navigates to `/assets`.

```
User navigates to /assets
        │
        ▼
Next.js runs assets/page.tsx on the server  [SERVER]
        │
        ├── getAssets()      ──► fetchWithAuth GET /assets      ──► Express ──► PostgreSQL
        ├── getRoles()       ──► fetchWithAuth GET /roles       ──► Express ──► PostgreSQL
        └── getAssetTypes()  ──► fetchWithAuth GET /assettypes  ──► Express ──► PostgreSQL
        │
        │   All three run before anything is rendered.
        │   roles and assetTypes are needed to populate
        │   the dropdown options in the add/edit form.
        │
        ▼
assets/page.tsx renders the full component tree with real data:
  ├── TableHeading with column names
  ├── One TableRow per asset
  │     Each row receives its full asset record as a prop
  │     Each row also receives the edit and delete server actions
  └── TableFooter (empty state message if no assets exist)
  └── AddButton (only rendered if roles and asset types exist)
        │
        ▼
Next.js converts the component tree to HTML and sends it to the browser
        │
        ▼
Browser displays the page immediately (no loading spinner needed)
        │
        ▼
React "hydrates" the Client Components in the background:
  AddButton, EditButton, DeleteRecordButton, GenericModal, ModalForm
  These attach their event listeners and become interactive
```

### Why are roles and asset types also fetched?

The add/edit form has dropdown fields for "Asset Type" and "Asset Owner" (role). Those dropdowns need their options ready before the user opens the modal — fetching them lazily on modal open would cause a visible delay. By fetching everything up front in the Server Component, the modal opens instantly with all options already available.

---

## 5. Flow: Adding an Asset

```
User clicks "+" button
        │
        ▼
AddButton sets isModalOpen = true  [CLIENT state]
        │
        ▼
GenericModal becomes visible
        │
        ▼
ModalForm renders with mode="add"
useModalForm initialises formData with empty/default values
        │
        ▼
User fills in fields → handleChange updates formData  [CLIENT state]
        │
        ▼
User clicks "Add"
        │
        ▼
handleAdd fires inside useModalForm
startTransition wraps the async call → isPending = true → button disables
        │
        ▼
createAsset(formData) is called  [SERVER ACTION]
  ├── Next.js sends a POST request to the Next.js server
  ├── fetchWithAuth calls the Express API: POST /assets/
  └── Express saves the record to PostgreSQL
        │
        ▼
Server action calls revalidatePath("/assets")
  └── Next.js marks the cached page as stale
        │
        ▼
isPending = false → button re-enables
Toast notification shown ("Record created successfully")
Modal closes, form resets
        │
        ▼
Next.js router refetches /assets from the server
assets/page.tsx re-runs: getAssets() returns the updated list
The new asset appears in the table
```

### What is revalidatePath?

After a mutation, the server-rendered page is stale — it was built before the new asset existed. `revalidatePath("/assets")` tells Next.js to throw away the cached version and rebuild the page fresh. Next.js then automatically triggers a refetch in the browser, and the Server Component re-runs with fresh data from PostgreSQL.

---

## 6. Flow: Editing an Asset

```
User clicks the edit icon on a row
        │
        ▼
EditButton sets isModalOpen = true  [CLIENT state]
        │
        ▼
GenericModal becomes visible with mode="edit"
        │
        ▼
ModalForm renders
useModalForm useEffect runs:
  ├── Reads initialData (the full asset record already in the component as a prop)
  └── Populates formData with the asset's current values — no network call needed
        │
        ▼
User modifies fields → handleChange updates formData  [CLIENT state]
        │
        ▼
User clicks "Save"
        │
        ▼
handleEdit fires inside useModalForm
startTransition wraps the async call → isPending = true → button disables
        │
        ▼
editAsset(id, formData) is called  [SERVER ACTION]
  ├── Next.js sends a POST request to the Next.js server
  ├── fetchWithAuth calls the Express API: PUT /assets/:id
  └── Express updates the record in PostgreSQL
        │
        ▼
Server action calls revalidatePath("/assets")
isPending = false, toast shown, modal closes
        │
        ▼
Next.js router refetches /assets from the server
assets/page.tsx re-runs: getAssets() now returns the updated record
React reconciles the new HTML with the existing page —
only the changed row in the table updates, everything else stays the same
```

### Why is initialData not re-fetched when Edit is clicked?

The Server Component (`assets/page.tsx`) already fetched every asset when the page loaded. Each `TableRow` receives its full asset record as a prop. `EditButton` receives that record as `initialData` and passes it straight into the modal — no extra network call needed. The data is already in the component tree.

### How does the updated value appear in the list after saving?

The server action calls `revalidatePath("/assets")`, which marks the page cache as stale. Next.js then automatically re-requests the page from the server in the background. `assets/page.tsx` runs again, `getAssets()` hits the Express API which queries PostgreSQL and returns the freshly updated record. React updates only the parts of the DOM that changed — in this case, the text in the affected table row.

---

## 7. Flow: Deleting an Asset

```
User clicks the delete icon on a row
        │
        ▼
handleDelete fires inside useDelete
        │
        ▼
Browser confirm() dialog: "Are you sure you want to delete this asset?"
        │
        ├── User cancels → nothing happens
        │
        └── User confirms
                │
                ▼
        startTransition wraps the async call → isPending = true → button disables
                │
                ▼
        deleteAction() is called  [SERVER ACTION]
          ├── fetchWithAuth calls the Express API: DELETE /assets/:id
          └── Express deletes the record from PostgreSQL
                │
                ▼
        Server action calls revalidatePath("/assets")
        isPending = false
                │
                ▼
        Next.js refetches /assets — the deleted asset no longer appears
```

---

## 8. Why Server Actions?

Server actions (files with `"use server"`) are **the only safe way to call mutations from a Client Component**.

When a Client Component calls a server action, Next.js serialises the arguments, sends them as a POST request to the Next.js server, runs the function there, and returns the result. The Express API is never exposed to the browser.

```
Browser → Next.js server (POST, secure) → Express API → PostgreSQL
```

Plain async functions (like those in `assetQueries.ts`) are **not** server actions. They have no directive and are called only from Server Components at page-render time. If you tried to import them into a Client Component, Next.js would throw an error because they use server-only APIs.

| File | Directive | Called from | Purpose |
|---|---|---|---|
| `assetQueries.ts` | none | Server Component | Read data at page load |
| `assetActions.ts` | `"use server"` | Client Components | Mutate data (create/edit/delete) |

---

## 9. Why Hooks?

React hooks are functions that let Client Components manage state and side effects. They cannot be used in Server Components.

### useState

Stores a value that, when changed, causes the component to re-render.

Used in `AddButton` and `EditButton` to track whether the modal is open:

```ts
const [isModalOpen, setIsModalOpen] = useState(false);
// isModalOpen starts as false
// calling setIsModalOpen(true) re-renders the component with modal visible
```

Used in `useModalForm` to track the current form field values:

```ts
const [formData, setFormData] = useState(defaultValues(fields));
```

### useEffect

Runs a side effect **after** a component renders. A side effect is anything outside of React's rendering process — in this case, populating the form with the existing record's data when the edit modal opens.

```ts
useEffect(() => {
  if (!isModalOpen || mode === "add" || !initialData) return;
  // populate formData from initialData
}, [isModalOpen, mode, initialData, fields]);
// dependency array: re-runs whenever any of these values change
```

The **dependency array** controls when the effect re-runs:
- `[]` — runs once, on mount only
- No array — runs after every render
- `[isModalOpen, mode, initialData, fields]` — runs when any of those values changes

Without `useEffect` you would be trying to update state during rendering, which React does not allow.

### useTransition

Returns `[isPending, startTransition]`. Wrapping an async call in `startTransition` sets `isPending = true` for the duration of the operation, then back to `false` when it resolves. This is used to disable buttons during in-flight requests to prevent double submissions.

```ts
const [isPending, startTransition] = useTransition();

const handleEdit = async (e) =>
  startTransition(async () => {
    await editAsset(id, formData); // isPending = true while this runs
  });                              // isPending = false when done
```

`SaveOrAddButton` receives `isPending` and sets `disabled={isPending}`. The delete button does the same via `useDelete`.

### useCallback

Memoises a function so the same function reference is returned on every render, unless its dependencies change.

```ts
const handleDelete = useCallback(() => {
  // confirm and call deleteAction
}, [deleteAction, recordName, onConfirm, onSuccess, onError]);
```

**What happens without `useCallback`?**
Every time React re-renders `DeleteRecordButton`, `useDelete` runs again and `handleDelete` is created as a brand new function. Even though the function does the same thing, it is a different object in memory. If `handleDelete` were listed as a dependency in a child component's `useEffect` or `useCallback`, that constant change in reference would cause those effects to re-run on every render — even when nothing meaningful has changed. `useCallback` prevents this by keeping the same reference stable across renders, as long as the dependencies stay the same.

---

## 10. Custom Hooks

Custom hooks are plain functions whose names start with `use`. They extract and reuse stateful logic that would otherwise be duplicated across components, keeping component files focused purely on **presentation**.

This directly maps to the layered architecture described in section 1 — hooks are the business/interaction logic layer sitting between the presentation components and the mutation layer.

### useModalForm

Owns all state and logic for the modal form so `ModalForm.tsx` only has to worry about rendering.

Responsibilities:
- Initialises `formData` with defaults (add mode) or existing record values (edit mode)
- `handleChange` — updates `formData` as the user types
- `handleEdit` — calls the edit server action, shows a toast, closes the modal
- `handleAdd` — calls the create server action, resets the form, closes the modal
- Tracks `isPending` via `useTransition` to disable the button during submission

### useDelete

Owns the delete confirmation and server action call so `DeleteRecordButton.tsx` only has to worry about rendering.

Responsibilities:
- `handleDelete` — shows a confirm dialog, then calls the delete server action
- Tracks `isPending` via `useTransition` to disable the button during deletion
- Accepts optional `onConfirm`, `onSuccess`, `onError` callbacks for flexibility

---

## 11. Full Data Flow Summary

```
                    PAGE LOAD
                    ─────────
User navigates to /assets
        │
        ▼
assets/page.tsx runs on the server
  ├── getAssets()       ──► Express GET /assets       ──► PostgreSQL
  ├── getRoles()        ──► Express GET /roles        ──► PostgreSQL
  └── getAssetTypes()   ──► Express GET /assettypes   ──► PostgreSQL
        │
        ▼
Full HTML page sent to browser with all data embedded
React hydrates Client Components (AddButton, EditButton, etc.)


                    MUTATIONS (Add / Edit / Delete)
                    ────────────────────────────────
User interacts with a Client Component
  │
  └── calls a server action (createAsset / editAsset / deleteAsset)
        │
        └── Next.js server receives POST request
              │
              └── fetchWithAuth ──► Express ──► PostgreSQL
                    │
                    └── revalidatePath("/assets")
                          │
                          └── Next.js rebuilds the page
                                │
                                └── Browser re-renders with fresh data
```

---

## 12. Suggested Reading Order

Trace the code in this order to follow the architecture from top to bottom:

1. [assets/page.tsx](../../frontend/src/app/assets/page.tsx) — start here, the entry point
2. [assetQueries.ts](../../frontend/src/app/actions/assetQueries.ts) — how data is read at page load
3. [assetActions.ts](../../frontend/src/app/actions/assetActions.ts) — how data is mutated
4. [TableRow.tsx](../../frontend/src/components/ui/TableRow.tsx) — how each row is rendered
5. [RowActionButtons.tsx](../../frontend/src/components/ui/RowActionButtons.tsx) — edit and delete buttons per row
6. [EditButton.tsx](../../frontend/src/components/features/EditButton.tsx) — edit modal trigger
7. [DeleteButton.tsx](../../frontend/src/components/features/DeleteButton.tsx) — delete trigger
8. [GenericModal.tsx](../../frontend/src/components/ui/GenericModal.tsx) — modal shell
9. [ModalForm.tsx](../../frontend/src/components/features/ModalForm.tsx) — form inside the modal
10. [useModalForm.ts](../../frontend/src/hooks/useModalForm.ts) — form state and submission logic
11. [useDelete.ts](../../frontend/src/hooks/useDelete.ts) — delete state and logic
12. [AddButton.tsx](../../frontend/src/components/features/AddButton.tsx) — add modal trigger
