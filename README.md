# Circular Economy Educational Hardware Platform

A full-stack web application designed to connect tech donors with educational organizations, automatically matching hardware with verified technicians via geolocation routing, promoting a circular economy and reducing e-waste.

## Quick path

1. **Install dependencies:** `pnpm install`
2. **Setup environment:** Ensure PostgreSQL is running and update `.env` (default port 5433).
3. **Run database migrations:** `pnpm exec drizzle-kit push` (or run migrations).
4. **Start the development server:** `pnpm run dev`

## Details

| Component | Technology | Decision & Reasoning |
|-----------|------------|----------------------|
| **Framework** | TanStack Start (React + SSR) | Provides bleeding-edge server-side rendering, robust file-based routing, and high performance. |
| **Styling** | Tailwind CSS v4 + Kanagawa | Selected Vanilla Tailwind v4 with `@theme` block. Kanagawa Dragon palette ensures a premium dark aesthetic. |
| **Database** | PostgreSQL + PostGIS (via Drizzle) | PostGIS was chosen to handle the complex geospatial radius logic for automatically assigning hardware to the nearest technician. |
| **Auth** | Lucia Auth | Handles secure, session-based authentication for Donors, Admins, and Technicians. |
| **Testing** | Vitest | Runs unit and integration tests (with test isolation to prevent database state collision). |

## Architecture & SDD

The platform was built using **Spec-Driven Development (SDD)**. All architectural decisions, tasks, and verifications are preserved in the `openspec/` directory.

- The application uses chained feature PRs (stacked branches) when line counts exceed review budgets.
- All styles are isolated in `app/styles/global.css` using semantic tokens mapping to Tailwind v4.

## Checklist

- [ ] Node.js & pnpm installed locally.
- [ ] Docker installed for running PostGIS via `docker-compose.yml`.

## Next step

See the `openspec/changes/` directory for historical architectural decisions, or check out the [TanStack Start documentation](https://tanstack.com/start/latest) for framework details.
