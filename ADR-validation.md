# ADR: Validation Strategy (Frontend & Backend)

**Status:** Accepted  
**Date:** 2026-05-19  
**Deciders:** Arturo AH

## Context

The system has frontend (React/Node.js) and backend (Node.js) applications running in separate containers. Each layer needs to validate data independently—the frontend for user experience and the backend as a security boundary.

Early design considered sharing validation schemas between frontend and backend to reduce code duplication, but this approach was rejected. At the current stage of development, we are not engineering for shared code between containerized services. Attempting to share validation logic across containers creates infrastructure dependencies and build complexity that isn't justified by the current project scope.

## Decision

We implement independent validation layers for frontend and backend, each tailored to its specific concerns:

### Backend Validation
- **Technology:** Zod schemas in TypeScript
- **Location:** `backend/src/schemas/` (e.g., `userSchemas.ts`)
- **Integration:** Express middleware factory at route level
- **Response Code:** HTTP 422 (Unprocessable Entity) for validation errors
- **Error Format:** `{ fieldErrors: { [field]: "error message" } }`
- **Schemas:** Mode-aware (`createUserSchema`, `updateUserSchema`)

### Frontend Validation
- **Technology:** Zod schemas in TypeScript  
- **Location:** `frontend/src/schemas/` (e.g., `userSchemas.ts`)
- **Integration:** Custom `useModalForm` hook and server actions
- **Error Handling:** Field-level errors displayed in form UI
- **Schemas:** Mode-aware (registered in `schemasRegistry` with `add`/`edit` modes)

## Why Shared Schemas Don't Work

**Separate Containers, Different Concerns**
- Backend and frontend run in separate Docker containers with independent codebases
- Sharing code between containers requires complex build orchestration that isn't worth the effort at this project stage
- Each container should be independently deployable without dependencies on the other

**Different Execution Contexts**
- Backend validation guards against malformed requests and database constraint violations
- Frontend validation provides immediate UX feedback without network round-trips
- These are fundamentally different concerns with different failure modes and requirements

**Security Boundary**
- Backend validation is non-negotiable; even if frontend validation passes, backend must re-validate (never trust the client)
- Frontend validation is purely a UX optimization and cannot be relied upon for security
- Attempting to share code creates a false sense of validation coverage on the backend

**Independent Evolution**
- Backend rules may change based on business logic or database schema changes
- Frontend rules may change based on UX improvements or changing validation timing
- Without sharing code, each layer is free to evolve independently
- Documentation (not code) ensures consistency where it matters

## Mode-Dependent Validation

Both frontend and backend support different validation rules for create vs. update operations:

```typescript
// Backend: Two distinct schemas
export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password_hash: z.string().min(8).max(128),  // Required
});

export const updateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password_hash: z.string().refine(
    (val) => val === "" || (val.length >= 8 && val.length <= 128),
    { message: "Password must be 8–128 characters if provided" },
  ),  // Optional, allows empty string for "no change" scenario
});
```

```typescript
// Frontend: Schemas keyed by operation mode
export const schemasRegistry = {
  user: {
    password_hash: {
      add: passwordAddSchema,    // Password required
      edit: passwordEditSchema,  // Password optional
    },
  },
} as const;
```

This flexibility allows:
- **Create mode:** Enforce all required fields (e.g., password must be provided)
- **Edit mode:** Relax constraints for optional updates (e.g., password omitted = no change)
- **Domain-specific rules:** Different entities can have different validation strategies

## Adding New Validation Rules

When implementing a new validation rule, follow this checklist:

### 1. Identify the Scope
- [ ] Does this rule apply to create, edit, or both operations?
- [ ] Does this rule apply to all entities or just one (e.g., only `user`)?

### 2. Backend Implementation
- [ ] Add/update Zod schema in `backend/src/schemas/<entity>Schemas.ts`
  - Create separate `create<Entity>Schema` and `update<Entity>Schema` if needed
  - Use Zod methods for common validations: `.min()`, `.max()`, `.email()`, `.refine()`
- [ ] Add middleware to the route(s) that use this schema:
  ```typescript
  router.post("/", validate(createUserSchema), userControllers.createUser);
  router.put("/:id", validate(updateUserSchema), userControllers.updateUser);
  ```
- [ ] Remove manual validation guards from controllers (validation happens in middleware, not in the handler)
- [ ] Write tests in `backend/src/tests/schemas/<entity>Schemas.test.ts`
  - Test valid inputs, boundary cases (min/max lengths), and invalid inputs
  - Use `safeParse()` to test validation without throwing

### 3. Frontend Implementation
- [ ] Add/update Zod schema in `frontend/src/schemas/<entity>Schemas.ts`
  - Create `<field>AddSchema` and `<field>EditSchema` if rules differ by mode
- [ ] Register schema(s) in `frontend/src/schemas/schemasRegistry.ts`:
  ```typescript
  export const schemasRegistry = {
    user: {
      password_hash: {
        add: passwordAddSchema,
        edit: passwordEditSchema,
      },
    },
  } as const;
  ```
- [ ] Ensure the entity has a `domain` prop passed to form components:
  - `AddButton` accepts `domain?` and passes to `GenericModal`
  - `TableRow` accepts `domain?` and passes to `RowActionButtons`
  - `GenericModal` and `ModalForm` use schemas from registry if domain is provided
- [ ] Test via the UI:
  - Attempt to submit invalid data
  - Verify error message displays correctly
  - Verify valid data submits without client-side errors

### 4. Server Action Error Relay
- [ ] Ensure the server action (e.g., `createUser` action) catches backend validation errors:
  ```typescript
  export async function createUser(data: unknown) {
    const result = await api.post("/users", data);
    if (!result.ok) {
      return { success: false, error: result.message, fieldErrors: result.fieldErrors };
    }
    return { success: true };
  }
  ```
- [ ] `ModalForm` displays `fieldErrors` to the user via `FieldError` component
- [ ] If no server-side validation errors occur, the form closes

### 5. Testing
- [ ] Backend: Schema unit tests pass (test the Zod schema directly)
- [ ] Backend: Middleware integration tests pass (test the full request/response cycle)
- [ ] Frontend: Form submits with valid data, shows errors with invalid data
- [ ] Frontend and Backend: Validation rules should logically align (for consistency; backend is authoritative)

## Validation Flow

### Create Flow
```
User enters data in form (frontend)
     ↓
Frontend validates (UX feedback using local schemas)
     ↓
User clicks "Save"
     ↓
Server action sends data to backend (HTTP POST)
     ↓
Backend middleware validates with schema (HTTP 422 if invalid)
     ↓
If invalid: return { fieldErrors: {...} }
     ↓
Server action catches error, returns fieldErrors to ModalForm
     ↓
ModalForm displays field-level errors
     ↓
User corrects and resubmits (loop back to "User enters data")
```

### Edit Flow
Same as create, but uses update-mode schemas (with relaxed constraints for optional fields).

## HTTP Status Codes

- **200 OK:** Validation passed, resource created/updated
- **400 Bad Request:** Malformed request (wrong content-type, invalid JSON)
- **422 Unprocessable Entity:** Validation failed (field-level errors)
- **500 Internal Server Error:** Unexpected server error

## Optional Fields in Validation

Use Zod's optional/conditional refinements for fields that behave differently by mode:

```typescript
// Create mode: password required
const createSchema = z.object({
  password_hash: z.string().min(8).max(128),
});

// Edit mode: password optional
const updateSchema = z.object({
  password_hash: z.string().refine(
    (val) => val === "" || (val.length >= 8 && val.length <= 128),
  ),
});
```

This allows:
- Enforcing presence of required data on create
- Allowing "no change" (empty string) on edit while still validating if the user provides a value

## Consequences

### Advantages
- **Clear responsibility:** Each layer owns its validation logic, no cross-container dependencies
- **Flexibility:** Rules can evolve independently without tight coupling
- **Security:** Backend is the authoritative validation boundary; frontend errors are UX-only
- **Performance:** Frontend validation catches obvious errors immediately before sending requests
- **Simplicity:** No build-time orchestration needed; each container builds independently
- **Testability:** Backend schemas are testable in isolation; frontend validation is testable via form interaction

### Disadvantages
- **Duplication:** Similar rules exist in both layers (intentional for decoupling)
- **Maintenance:** Changes to validation rules may need updates in both places (two commits, same feature)
- **Drift Risk:** Frontend and backend rules can diverge if not updated together

### Mitigation
- Document validation rules clearly in code comments and this ADR
- When updating a rule, update both layers together in the same feature branch
- Frontend schemas serve as "happy path" convenience; backend is the source of truth
- Treat validation rule documentation (comments in schema files) as a reference contract between frontend and backend
- Periodically audit frontend and backend validation rules for drift

## File Reference

- **Backend schemas:** `backend/src/schemas/`
- **Backend validation middleware:** `backend/src/middleware/validate.ts`
- **Backend schema tests:** `backend/src/tests/schemas/`
- **Frontend schemas:** `frontend/src/schemas/`
- **Schema registry:** `frontend/src/schemas/schemasRegistry.ts`
- **Frontend form hook:** `frontend/src/hooks/useModalForm.ts`
- **Frontend components:** 
  - `frontend/src/components/features/AddButton.tsx`
  - `frontend/src/components/features/EditButton.tsx`
  - `frontend/src/components/features/ModalForm.tsx`
  - `frontend/src/components/ui/TableRow.tsx`
