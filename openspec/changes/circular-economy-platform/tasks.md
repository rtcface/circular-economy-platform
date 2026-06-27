# Tasks: Circular Economy Platform

## Review Workload Forecast

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

| Field | Value |
|-------|-------|
| Estimated changed lines | 1500 - 2500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Setup & DB | PR 1 | Base branch: main. Docker compose, DB schemas, Drizzle config, TanStack root. |
| 2 | Auth | PR 2 | Base branch: PR 1 branch. Lucia integration, user roles, auth routes. |
| 3 | Intake UI | PR 3 | Base branch: PR 2 branch. Admin & Donor dashboards, donation intake forms. |
| 4 | Matching Logic | PR 4 | Base branch: PR 3 branch. PostGIS logic, technician queues, and core workflows. |

## Phase 1: Infrastructure & DB setup

- [x] 1.1 Create `docker-compose.yml` with the `postgis/postgis` image and map local ports.
- [x] 1.2 Initialize Drizzle ORM config and create `app/db/index.ts` for the connection client.
- [x] 1.3 Create `app/db/schema.ts` defining `users` and `donations` tables with PostGIS geometry (`ST_Point`).
- [x] 1.4 Setup TanStack Start root layout in `app/routes/__root.tsx` and basic `index.tsx`.

## Phase 2: Authentication & Users

- [x] 2.1 Implement `app/lib/auth.ts` setting up Lucia with session schema and database adapter.
- [x] 2.2 Create `app/routes/auth/login.tsx` for the login page.
- [x] 2.3 Create `app/routes/auth/register.tsx` for registration with role selection and basic location map.
- [x] 2.4 Add role-based middleware guards to protect routes.


## Phase 3: Hardware Intake & Validation

- [x] 3.1 Create `app/routes/donor/index.tsx` with a donation submission form and photo uploads.
- [x] 3.2 Implement server function to save donations with a `pending_validation` status.
- [x] 3.3 Create `app/routes/admin/index.tsx` for viewing and approving pending hardware.
- [x] 3.4 Write integration tests to verify the donor intake and admin approval lifecycle.

## Phase 4: Geospatial Matching & Refurbishment

- [x] 4.1 Implement `app/lib/matching.ts` using Drizzle for PostGIS spatial capacity/radius queries.
- [x] 4.2 Create server function to auto-assign a technician upon admin approval.
- [x] 4.3 Create `app/routes/technician/index.tsx` showing the assigned hardware and status transition actions.
- [x] 4.4 Write E2E/Integration tests for PostGIS matching to verify limits and radius bounds.
