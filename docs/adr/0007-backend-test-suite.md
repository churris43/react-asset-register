# ADR 0007: Backend Test Suite

- **Date:** 2026-05-14
- **Status:** Accepted

---

## Context

The backend needed a test suite that could run both locally and in CI (GitHub Actions) before Railway deploys. A real PostgreSQL database was preferred over mocking so that actual query logic — including sorting, pagination, and foreign key constraints — is exercised.

---

## Decision

Tests run against a dedicated PostgreSQL instance using [Vitest](https://vitest.dev) as the test runner. The database is a Docker container on port `5433` to avoid clashing with the development database on `5432`.

---

## Configuration files

| File | Purpose |
|---|---|
| `backend/vitest.config.ts` | Test runner configuration — global setup, setup files, parallelism |
| `backend/docker-compose.test.yml` | Defines the test PostgreSQL container |
| `backend/.env.test` | `DATABASE_URL` and `JWT_SECRET` for the test database (not committed — see `.env.test.example`) |
| `backend/src/tests/globalSetup.ts` | Runs `prisma migrate deploy` once before the entire suite |
| `backend/src/tests/setup.ts` | Truncates all tables before each test to prevent data leaking between tests |

---

## Test isolation: deleteMany instead of transaction rollback

The cleaner approach to test isolation would be to wrap each test in a database transaction and roll it back after. This avoids any real writes and is faster than truncating.

This is not currently possible because all service functions use the global `prisma` singleton imported from `lib/prisma.ts` directly. There is no way to pass an alternative client (such as a transaction client `tx`) to a service from the outside, so the test cannot intercept the calls and roll them back.

Instead, `setup.ts` truncates all tables in `beforeEach` using `deleteMany`. The deletion order respects foreign key constraints — `asset` is deleted before `role` and `asset_type` because it holds foreign keys to both.

**When a new table is introduced**, `setup.ts` must be updated:

1. Add a `prisma.<new_table>.deleteMany()` call to the `$transaction` array in `setup.ts`.
2. Position it before any table it references via foreign key.

If transaction-based rollback becomes desirable in the future, service functions would need to be refactored to accept an optional Prisma client parameter (e.g. `db = prisma`) so a `tx` client can be injected from tests.

---

## Running tests locally

Start the test container, run the suite, and tear the container down:

```bash
test-backend
```

This alias is defined in `alias/alias.sh`. To make it available in your shell, add the following to your `~/.zshrc`:

```bash
source /path/to/react-asset-register/alias/alias.sh
```

Then reload with `source ~/.zshrc`.

If the alias is not available, run the command manually from inside `backend/`:

```bash
docker compose -f docker-compose.test.yml up -d --wait && npm test; docker compose -f docker-compose.test.yml down
```

The `;` before `docker compose down` ensures the container is always stopped regardless of whether tests pass or fail.

---

## Tests do not run in parallel

`vitest.config.ts` sets `fileParallelism: false`, which forces test files to run one at a time.

By default Vitest runs each test file in its own worker in parallel. Since all workers share the same database, a `beforeEach` truncating tables in one worker can delete rows that another worker's test just created, causing foreign key violations or incorrect counts. Running files serially eliminates this race condition entirely.

---

## CI

GitHub Actions runs the test suite using a native Postgres service container — no Docker Compose is needed in that environment. The `DATABASE_URL` is injected as an environment variable in the workflow. Railway deploys only after the test job passes.