## Exploration: Circular Economy Platform for Educational Hardware

### Current State
This is a greenfield project. Currently, there is no codebase or existing architecture. The system needs to be designed from scratch to handle the donation flow, hardware validation, and automatic assignment logic for workshops in Tlaxcala.

### Affected Areas
- `openspec/changes/circular-economy-platform/` — New project architecture and configuration
- Entire repository will be scaffolded based on the chosen stack.

### Approaches
1. **Full-stack Meta-framework (Next.js + Supabase)** — A single repository using Next.js (App Router) for both the UI and backend logic, backed by Supabase (PostgreSQL).
   - Pros: Single codebase (TypeScript) making it easy for open-source contributions; Supabase provides built-in Auth, Row Level Security, and PostGIS for location-based routing; easy and free/cheap deployment on Vercel.
   - Cons: Tightly couples frontend and backend logic; Next.js App Router has a learning curve for some developers.
   - Effort: Low

2. **Separated SPA and REST API (React/Vite + NestJS/PostgreSQL)** — A decoupled architecture with a React frontend built with Vite, and a robust backend API built with NestJS and PostgreSQL.
   - Pros: Strict separation of concerns; backend is completely decoupled and ready for multiple clients (e.g., future mobile app); NestJS enforces a strong architectural pattern.
   - Cons: Higher setup overhead; requires managing two deployments (e.g., Vercel for frontend, Render/Railway for backend); cross-repository management.
   - Effort: Medium

3. **Low-Code MVP (Airtable + Make + Softr/Glide)** — Using a combination of Airtable for the database, Make for the automatic assignment automation, and a tool like Softr for the donor/technician portals.
   - Pros: Extremely fast time-to-market to validate the community need; non-technical volunteers can maintain it.
   - Cons: Strong vendor lock-in; limited custom UI/UX; harder to adapt to complex matching logic or accept code contributions from the community.
   - Effort: Very Low

### Recommendation
**Approach 1: Full-stack Meta-framework (Next.js + Supabase)**
This approach is the most balanced for a community-driven project. A single TypeScript repository lowers the barrier to entry for open-source contributors. Supabase's PostgreSQL with PostGIS extension is perfectly suited for the automatic location-based assignment of donations to workshops in Tlaxcala. It allows rapid delivery while keeping the foundation fully open-source and scalable.

### Risks
- **Hardware Validation Friction**: Implementing a "strict baseline" check in software without adding too much friction for donors. We need an intuitive, possibly image-based or simple questionnaire UI.
- **Assignment Logic Edge Cases**: If a workshop reaches capacity or there are no workshops near the donor, the system needs a fallback (e.g., a central warehouse or waiting list).
- **No-Show Donors**: Donors are responsible for delivery. If they don't deliver after assignment, workshop capacity might be locked artificially.

### Ready for Proposal
Yes — The orchestrator can tell the user that the technical paths are clear, recommending Next.js with Supabase to handle the application and location-based logic, and ask if they are ready to proceed with defining the product proposal and specific flows.
