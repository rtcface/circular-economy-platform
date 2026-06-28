# Circular Economy Educational Hardware Platform

A full-stack web application designed to connect tech donors with educational organizations, automatically matching hardware with verified technicians via geolocation routing, promoting a circular economy and reducing e-waste.

## Quick path

1. **Install dependencies:** `pnpm install`
2. **Setup environment:** Ensure Docker is running and run `docker compose up --build -d` to launch the database and the web application.
3. **Run database migrations:** `pnpm exec drizzle-kit push` (to ensure the schema is applied to the PostGIS instance on port 5433).
4. **Access the application:** The app will be available at `http://localhost:4000/`.

## Details

| Topic | Decision |
|-------|----------|
| Framework | **TanStack Start (React + SSR):** Provides bleeding-edge server-side rendering, robust file-based routing, and high performance. |
| Styling | **Tailwind CSS v4 + Kanagawa:** Selected Vanilla Tailwind v4 with `@theme` block. Kanagawa Dragon palette ensures a premium dark aesthetic. |
| Database | **PostgreSQL + PostGIS (via Drizzle):** PostGIS was chosen to handle the complex geospatial radius logic for automatically assigning hardware to the nearest technician. |
| Auth | **Lucia Auth:** Handles secure, session-based authentication for Donors, Admins, and Technicians. |
| Testing | **Vitest:** Runs unit and integration tests with test isolation to prevent database state collision (`fileParallelism: false`). |

## Architecture & SDD

The platform was built using **Spec-Driven Development (SDD)**. All architectural decisions, tasks, and verifications are preserved in the `openspec/` directory.

- The application uses chained feature PRs (stacked branches) when line counts exceed review budgets.
- All styles are isolated in `app/styles/global.css` using semantic tokens mapping to Tailwind v4.

## Checklist

- [ ] Docker installed for running PostGIS and the web server via `docker-compose.yml`.
- [ ] Node.js (v22+) & pnpm installed locally if running in development mode.
- [ ] `.env` file created (defaults to `postgres://postgres:password@localhost:5433/circular_economy`).

## Next step

See the `openspec/changes/` directory for historical architectural decisions, or check out the [TanStack Start documentation](https://tanstack.com/start/latest) for framework details.
