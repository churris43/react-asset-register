# ADR 0004: Database Seeding

- **Date:** 2026-05-12
- **Status:** Accepted

---

## Context

The application needs a repeatable way to populate the database with reference data (roles, asset types, and assets) for local development and for resetting the Railway production/staging environment to a known state.

---

## Decision

A Prisma seed script (`backend/src/prisma/seed.ts`) is used with `ts-node` as the executor. It accepts an optional `--no-truncate` flag; by default all tables are truncated and repopulated from scratch.

The script is split into one function per table, each responsible for upserting its records and resetting its PostgreSQL auto-increment sequence. The truncation step is handled once in `main` before any seeder runs.

`upsert` is used throughout so the script is safe to run against a non-empty database when `--no-truncate` is passed. IDs are hardcoded so foreign key references between tables are predictable without runtime lookups.

---

## Running the seeder

### Local development (Docker Compose)

The seeder runs inside the `api` container so it shares the same `DATABASE_URL` that the Express server uses.

**Reset and repopulate (default):**

```bash
docker compose exec api npm run seed
```

**Add missing records without truncating:**

```bash
docker compose exec api npm run seed:no-truncate
```

You can also drop directly to a shell and run the commands manually if you need to iterate:

```bash
docker compose exec api sh
npm run seed
# or
npm run seed:no-truncate
```

### Railway (production/staging)

The Railway CLI (`railway shell` and `railway run`) runs commands **locally** with Railway's environment variables injected — it does not exec into the deployed container. Because of this, the default `DATABASE_URL` uses the private `postgres.railway.internal` hostname which is unreachable from your machine. You must use the public connection URL instead.

**1. Install the Railway CLI (one-time):**

```bash
npm install -g @railway/cli
```

**2. Authenticate and link your project (one-time):**

```bash
railway login
railway link   # select your project and environment when prompted
```

**3. Add `DATABASE_PUBLIC_URL` to the Railway backend service (one-time):**

In the Railway dashboard, open the **backend** service → **Variables** tab and add:

| Name | Value |
|------|-------|
| `DATABASE_PUBLIC_URL` | `${{Postgres.DATABASE_PUBLIC_URL}}` |

Replace `Postgres` with the exact name of your PostgreSQL service if it differs. Make sure there is no leading space in the value.

**4. Run the seeder via the Railway CLI:**

```bash
# Reset and repopulate (default)
railway run --service <your-backend-service-name> npm run seed:railway

# Add missing records without truncating
railway run --service <your-backend-service-name> npm run seed:railway:no-truncate
```

> Never commit the public connection string to source control. It contains your database credentials and is reachable from the internet.