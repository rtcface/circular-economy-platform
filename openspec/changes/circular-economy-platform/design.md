# Design: Circular Economy Platform

## Technical Approach

We will build a full-stack, typesafe React application using **TanStack Start**. This provides SSR, file-based routing, and server functions out of the box, ideal for our dynamic role-based dashboards. For the data layer, we will use **Drizzle ORM** connected to a Dockerized **PostgreSQL** database with the **PostGIS** extension to enable geospatial matching. Authentication will be handled via **Lucia Auth** (or a similar custom session-based solution) to retain complete control over the user schema and role management.

## Architecture Decisions

### Decision: Full-Stack Framework

**Choice**: TanStack Start
**Alternatives considered**: Next.js, Remix
**Rationale**: TanStack Start provides excellent type safety across the network boundary, leveraging TanStack Router. It fits the requirement for a modern, typesafe React full-stack application while keeping the tooling lightweight and closely tied to the Vite ecosystem.

### Decision: Database & ORM

**Choice**: PostgreSQL + PostGIS via Drizzle ORM
**Alternatives considered**: Prisma, MongoDB (with GeoJSON)
**Rationale**: We need rigorous relational data (users, roles, hardware lifecycle) combined with precise geographic distance queries (`ST_DWithin`). PostGIS is the industry standard for this. Drizzle ORM offers first-class support for custom SQL operators, making it easy to query PostGIS types without the overhead of Prisma's engine, while maintaining strict TypeScript safety.

### Decision: Authentication Strategy

**Choice**: Custom Session Auth using Lucia
**Alternatives considered**: Auth.js, Clerk, Supabase Auth
**Rationale**: The proposal explicitly requests custom authentication for donors, technicians, and admins. Lucia operates directly on our database schema, meaning we don't have to sync user roles, approval statuses (`is_approved`), and PostGIS locations with a third-party auth provider. It keeps the domain logic contained within our own database.

## Data Flow

The system orchestrates a hardware lifecycle from donation to refurbishment.

    Donor (UI) ──→ Submit Donation w/ Photos ──→ DB (Status: Pending Validation)
                                                        │
    Admin (UI) ──→ Approves Donation ───────────→ DB (Status: Accepted)
                                                        │
    System ──────→ PostGIS Match (Capacity & Proximity) → DB (Status: Pending Match -> Assigned)
                                                        │
    Technician(UI)→ Receives & Refurbishes ─────→ DB (Status: In Progress -> Ready to Deploy)
                                                        │
    Admin (UI) ──→ Distributes to Student ──────→ DB (Status: Distributed)

## Database Schema Highlights

- **`users`**: 
  - `id`, `email`, `password_hash`, `role` (enum: donor, technician, admin)
  - `status` (enum: pending_approval, active)
  - `location` (geometry Point, 4326)
  - `max_capacity`, `current_load` (for technicians)
- **`donations`**: 
  - `id`, `donor_id`, `technician_id` (nullable)
  - `status` (enum: pending_validation, accepted, pending_match, assigned, in_progress, ready_to_deploy, unrepairable)
  - `hardware_details` (jsonb or specific columns)
  - `photos` (text array)
  - `location` (geometry Point, 4326)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `docker-compose.yml` | Create | Provisions the `postgis/postgis` image and maps local ports. |
| `app/db/schema.ts` | Create | Drizzle ORM schema defining Users, Sessions, and Donations. |
| `app/db/index.ts` | Create | Database connection and client initialization. |
| `app/lib/auth.ts` | Create | Lucia auth configuration and role-based middleware functions. |
| `app/lib/matching.ts` | Create | PostGIS spatial queries for volunteer capacity/radius matching. |
| `app/routes/__root.tsx` | Create | TanStack Start root route with global layout and providers. |
| `app/routes/index.tsx` | Create | Landing page explaining the initiative. |
| `app/routes/auth/login.tsx` | Create | Login page. |
| `app/routes/auth/register.tsx` | Create | Registration page with role selection and map/location picker. |
| `app/routes/donor/` | Create | Donor dashboard and donation intake forms. |
| `app/routes/technician/` | Create | Technician queue showing assigned and in-progress hardware. |
| `app/routes/admin/` | Create | Admin dashboard for approving users and hardware validations. |

## Interfaces / Contracts

```typescript
// Core Data Types
export type Role = 'donor' | 'technician' | 'admin';
export type DonationStatus = 
  | 'pending_validation' 
  | 'accepted' 
  | 'pending_match' 
  | 'assigned' 
  | 'in_progress' 
  | 'ready_to_deploy' 
  | 'unrepairable';

// Server Function Contract for Matching
export interface MatchRequest {
  donationId: string;
  maxRadiusMeters: number;
}

export interface MatchResponse {
  success: boolean;
  assignedTechnicianId?: string;
  reason?: string; // e.g., "No technician within radius" or "Technicians at capacity"
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Matching Logic | Test `lib/matching.ts` with mocked Drizzle queries to ensure capacity limits and radius math are respected. |
| Integration | DB / PostGIS | Spin up a test PostGIS container to run real spatial queries against real data schemas. |
| E2E | Core Workflows | Playwright tests for donor submission, admin approval, and technician status updates. |

## Migration / Rollout

No migration required as this is a greenfield MVP. Standard Drizzle migrations will be used to manage schema evolution.

## Open Questions

- [ ] What specific mapping API (e.g., Mapbox, Google Maps, Leaflet/OSM) should be used on the frontend to capture user and donation coordinates?
- [ ] Should photo uploads be stored locally on the server (via standard FormData) or uploaded directly to an S3-compatible object store?
