# Proposal: Circular Economy Platform for Educational Hardware

## Intent

Bridge the digital divide in Tlaxcala by matching hardware donations with volunteer technicians for refurbishment and distributing them to low-income students.

## Scope

### In Scope
- Open donor process with hardware baseline validation.
- Capacity and geographic-based volunteer technician matching.
- Status tracking for refurbishment and distribution.
- Custom authentication for donors, technicians, and admins.

### Out of Scope
- Physical logistics management (donor delivers to the workshop).
- Payment or monetization features.

## Capabilities

### New Capabilities
- `donation-intake`: Validates baseline hardware quality and tracks incoming donations.
- `volunteer-matching`: Uses location and capacity to match hardware to technicians.
- `refurbishment-tracking`: Manages lifecycle from reception to ready-to-deploy status.
- `user-auth`: Custom authentication for system roles.

### Modified Capabilities
- None

## Approach

Implement a full-stack, typesafe React application using TanStack Start. Use a Dockerized PostgreSQL database with PostGIS for geographic matching of donors and technicians. Implement custom authentication (e.g., Auth.js or Lucia) for role-based access control.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `/src` | New | TanStack Start application frontend and backend routes |
| `/db` | New | PostgreSQL schema, PostGIS configuration, and migrations |
| `/docker-compose.yml` | New | Local database and application infrastructure |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Receiving "junk" hardware | High | Strict baseline validation forms and photo requirements before acceptance. |
| Poor technician-donor proximity | Medium | Leverage PostGIS to enforce maximum radius matching. |

## Rollback Plan

For the initial MVP deployment, rollback consists of reverting the deployment to the previous Git commit and running down-migrations for the database if schema changes fail.

## Dependencies

- PostgreSQL with PostGIS extension.
- Map/Geocoding API (for coordinates).
- Custom Auth implementation (Lucia / Auth.js).

## Success Criteria

- [ ] A donor can submit hardware and be validated against the quality baseline.
- [ ] A technician is automatically matched based on capacity and location.
- [ ] Hardware lifecycle is successfully tracked from donation to student delivery.
