# Design: Frontend UI Implementation

## Technical Approach
Implement Tailwind CSS v4 alongside TanStack Start's Vite integration. We will create an `app.config.ts` to add `@tailwindcss/vite` and define the "Kanagawa Dragon" design tokens using the new CSS `@theme` directive in `app/styles/global.css`. We will inject the stylesheet into `app/routes/__root.tsx` for SSR rendering. We will implement structural layout components (`Layout`, `MobileMenu`) and reusable UI elements (`GlassCard`, `NeonButton`, `Skeleton`) under `app/components/ui/` and `app/components/layout/`.

## Architecture Decisions

### Decision: Tailwind CSS v4 Configuration
**Choice**: Use `@tailwindcss/vite` plugin and configure themes natively in `global.css` using the `@theme` directive.
**Alternatives considered**: Using `tailwind.config.ts` (Tailwind v3 approach) or a separate PostCSS configuration.
**Rationale**: Tailwind v4 is CSS-first, meaning we can eliminate configuration files and rely entirely on modern CSS variables, which reduces complexity, removes Node-level abstractions, and simplifies the build pipeline in TanStack Start.

### Decision: Theming and Design System implementation
**Choice**: Define the Kanagawa Dragon colors and glassmorphism utilities using Tailwind v4 CSS variables.
**Alternatives considered**: Passing a JS context for theming or using CSS-in-JS.
**Rationale**: Native CSS variables supported by Tailwind v4 are inherently SSR-safe and highly performant. Defining `--color-sumiInk`, `--color-springGreen`, and `--color-dragonBlue` in `@theme` makes them immediately available as Tailwind utilities (e.g., `bg-sumiInk`).

### Decision: Glassmorphism Fallback Strategy
**Choice**: Use Tailwind utilities to provide opaque background fallbacks, applying backdrop-filters only where supported and conditionally dropping them when "Reduce Transparency" is active.
**Alternatives considered**: A JavaScript-based feature detection for backdrop filter support.
**Rationale**: Keeping styling completely within CSS avoids client-side hydration delays and ensures the fallback is present instantly on load, maintaining the no-FOUC requirement.

## Data Flow

    SSR Process                   Client Hydration
    ───────────                   ────────────────
    __root.tsx (Server)     ──→   __root.tsx (Client)
        │                               │
        ├─ Imports global.css           ├─ Restores state
        ├─ Renders Layout shell         ├─ Hydrates Mobile Menu
        └─ HTML with Tailwind classes   └─ Binds Hover/Click events

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `tailwindcss`, `@tailwindcss/vite` dependencies |
| `app.config.ts` | Create | Configure Vite with `@tailwindcss/vite` and TanStack Start plugins |
| `app/styles/global.css` | Create | Include `@import "tailwindcss";` and `@theme` block with Kanagawa colors |
| `app/routes/__root.tsx` | Modify | Import `global.css` and add it to the `<head>` to prevent FOUC |
| `app/components/layout/Layout.tsx` | Create | Main application shell, containing header and navigation |
| `app/components/layout/MobileMenu.tsx` | Create | Hamburger menu with slide-out drawer |
| `app/components/ui/GlassCard.tsx` | Create | Reusable card component with glassmorphism styles |
| `app/components/ui/NeonButton.tsx` | Create | Reusable button component with Kanagawa interactive hover states |
| `app/components/ui/Skeleton.tsx` | Create | Pulsing loading skeleton placeholder |

## Interfaces / Contracts

```css
/* app/styles/global.css (Conceptual Theme) */
@import "tailwindcss";

@theme {
  --color-sumi-ink: #16161D;
  --color-spring-green: #98BB6C;
  --color-dragon-blue: #658594;
  --color-fuji-white: #DCD7BA;

  --blur-glass: 12px;
  --opacity-glass: 0.7;
}
```

```tsx
// app/components/ui/GlassCard.tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string; // For extending utilities
}

// app/components/ui/NeonButton.tsx
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Components (`NeonButton`, `GlassCard`) | Render and verify correct Tailwind classes are applied |
| Unit | `MobileMenu` | Verify toggle state updates and renders drawer |
| Integration | `__root.tsx` SSR | Ensure `<link rel="stylesheet">` points to the compiled CSS without FOUC |
| E2E | Responsive Layout | Verify hamburger menu appears below desktop breakpoints |

## Migration / Rollout
No migration required. This establishes the initial UI layer for existing empty or minimally styled routes.

## Open Questions
- [ ] Are we using specific icons (e.g., Lucide) for the mobile menu hamburger/close buttons, or raw SVGs?
- [ ] Should the glassmorphism fallback use `sumi-ink` as the solid background color on devices with reduced transparency?
