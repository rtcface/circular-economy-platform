# Tasks: Frontend UI Implementation

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

| Field | Value |
|-------|-------|
| Estimated changed lines | 250 - 350 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full frontend UI setup | PR 1 | Base branch; all configuration, components, and layout included |

## Phase 1: Configuration & Foundation

- [x] 1.1 Update `package.json` to add `tailwindcss` and `@tailwindcss/vite` dependencies.
- [x] 1.2 Create `app.config.ts` and configure Vite to use `@tailwindcss/vite` alongside TanStack Start.
- [x] 1.3 Create `app/styles/global.css`, include `@import "tailwindcss";`, and define Kanagawa colors and glassmorphism properties in the `@theme` block.
- [x] 1.4 Modify `app/routes/__root.tsx` to import `global.css` and inject the stylesheet link into the `<head>` for SSR to prevent FOUC.

## Phase 2: Core UI Components

- [x] 2.1 Create `app/components/ui/GlassCard.tsx` to provide reusable glassmorphic styling and an opaque solid color fallback for reduced transparency environments.
- [x] 2.2 Create `app/components/ui/NeonButton.tsx` implementing `primary` and `secondary` variants, micro-interaction hover states, and a loading prop.
- [x] 2.3 Create `app/components/ui/Skeleton.tsx` for displaying pulsing placeholders during asynchronous data fetching.

## Phase 3: Layout & Navigation

- [x] 3.1 Create `app/components/layout/MobileMenu.tsx` that provides a collapsible hamburger toggle and responsive slide-out drawer behavior for mobile viewports.
- [x] 3.2 Create `app/components/layout/Layout.tsx` serving as the main application shell, integrating the `MobileMenu` and defining structural layout constraints.

## Phase 4: Testing & Verification

- [x] 4.1 Write component tests for `NeonButton` and `GlassCard` to verify correct Tailwind utility class application.
- [x] 4.2 Write component test for `MobileMenu` to verify state toggle and drawer rendering.
- [x] 4.3 Verify SSR styling injection manually or via E2E test on `__root.tsx` to guarantee no FOUC.
