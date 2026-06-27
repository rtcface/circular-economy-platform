# Proposal: Frontend UI Implementation

## Intent

The backend is complete, but the platform lacks a user interface. This change will establish the foundational UI architecture and implement a premium, mobile-responsive frontend using Tailwind CSS v4 to deliver a polished user experience with the "Kanagawa Dragon" aesthetic.

## Scope

### In Scope
- Setup Tailwind CSS v4 using `@tailwindcss/vite` within the TanStack Start build pipeline (`app.config.ts`).
- Define the "Kanagawa Dragon" semantic palette (sumiInk, springGreen, dragonBlue) in `global.css` via the `@theme` directive.
- Configure glassmorphism utility variables (e.g., blurs, border opacities).
- Implement global responsive layout including a mobile hamburger menu.
- Add premium micro-interactions (hover states, loading skeletons).
- Inject global stylesheet into `app/routes/__root.tsx` for proper SSR loading.

### Out of Scope
- Backend API modifications or new database models.
- Complex state management outside of UI presentation components.
- Complete page migrations (we are focusing on the shell and core UI utilities first).

## Capabilities

### New Capabilities
- `ui-core`: Foundational UI components, layout shell, mobile menu, and Tailwind v4 design system implementation.

### Modified Capabilities
- None

## Approach

Use Tailwind v4 with the `@tailwindcss/vite` plugin. The design tokens (Kanagawa semantic colors, glassmorphism utilities) will be explicitly defined using the new `@theme` block in `app/styles/global.css`. This avoids a complex config file, keeping JSX clean by leaning on reusable theme variables. The styles will be injected via `__root.tsx` to prevent flash of unstyled content during SSR.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add `tailwindcss` and `@tailwindcss/vite` dependencies |
| `app.config.ts` | New | Configure Vite plugins for TanStack Start |
| `app/styles/global.css` | New | Tailwind import and Kanagawa design system theme tokens |
| `app/routes/__root.tsx` | Modified | Import global CSS for SSR and client hydration |
| `app/components/layout/` | New | Base shell layout, mobile hamburger menu, loading skeletons |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Vite Config Conflicts | Low | Ensure `app.config.ts` aligns paths with `vitest.config.ts`. |
| SSR FOUC | Low | Ensure `global.css` is eagerly loaded in the root document `<head>`. |
| Accessibility of dark theme | Medium | Audit text contrast (sumiInk vs text) to ensure WCAG compliance. |

## Rollback Plan

Revert the commits adding Tailwind and modifying `__root.tsx`. Delete `app.config.ts` and `global.css` if they cause build pipeline failures, restoring to the pure unstyled TanStack Start baseline.

## Dependencies

- TanStack Start (existing)
- Vite (existing)

## Success Criteria

- [ ] Tailwind v4 compiles successfully in the Vite build process.
- [ ] "Kanagawa Dragon" palette and glassmorphism utilities can be used natively in JSX via Tailwind classes.
- [ ] Global layout features a working responsive mobile menu.
- [ ] Hover states and loading skeletons are functional and visible.
- [ ] No flash of unstyled content during SSR.

## Proposal question round

*Please review these assumptions before we lock the proposal:*
1. **Target Users**: Are the micro-interactions and premium aesthetic primarily aimed at regular users, or is this for an administrative dashboard?
2. **Current-State Gap**: Are there existing unstyled components that we should apply these new styles to immediately, or are we just building the empty shell layout?
3. **Edge Cases**: How should the UI respond if user connection is extremely slow? Should we define a baseline non-glass fallback?
4. **Business Tradeoff**: Glassmorphism and heavy blur filters can impact rendering performance on lower-end mobile devices. Should we provide a reduced-motion/reduced-transparency fallback?
