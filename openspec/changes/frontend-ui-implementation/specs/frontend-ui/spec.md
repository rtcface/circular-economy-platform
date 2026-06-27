# Frontend UI Specification

## Purpose

Defines the foundational UI architecture, responsive layout shell, and "Kanagawa Dragon" design system using Tailwind CSS v4.

## Requirements

### Requirement: Tailwind v4 and Kanagawa Theming

The system MUST implement Tailwind v4 and define the Kanagawa Dragon palette (`sumiInk`, `springGreen`, `dragonBlue`) and glassmorphism properties.

#### Scenario: Theme colors are applied successfully
- GIVEN the Tailwind v4 integration is active
- WHEN a component uses semantic classes like `bg-sumiInk`
- THEN the UI renders the correct Kanagawa hex color

#### Scenario: Glassmorphism rendering on capable devices
- GIVEN the device supports backdrop filters
- WHEN a component utilizes glassmorphism utility classes
- THEN it renders with translucent backgrounds and blurred backdrops

#### Scenario: Fallback for reduced transparency
- GIVEN the user's OS has "Reduce Transparency" enabled
- WHEN rendering a glassmorphic element
- THEN the element MUST fall back to a solid opaque background color

### Requirement: Responsive Layout and Mobile Menu

The system MUST render a globally responsive layout shell with a collapsible hamburger menu for mobile devices.

#### Scenario: Desktop viewport layout
- GIVEN the viewport width is greater than the mobile breakpoint
- WHEN the layout shell renders
- THEN the full horizontal navigation menu is displayed

#### Scenario: Mobile viewport layout and interaction
- GIVEN the viewport width is below the mobile breakpoint
- WHEN the layout shell renders
- THEN the navigation collapses into a hamburger menu
- AND clicking the hamburger toggles a responsive slide-out drawer

### Requirement: Premium Micro-interactions

The system MUST include interactive hover states and loading skeletons for asynchronous operations to provide a premium feel.

#### Scenario: Interactive element hover
- GIVEN an active button or link
- WHEN the user hovers over the element
- THEN a smooth visual transition (e.g., color, scale) is triggered

#### Scenario: Skeleton loader during data fetch
- GIVEN a component is waiting for asynchronous data
- WHEN the component mounts
- THEN a pulsing skeleton placeholder is displayed
- AND it is replaced by actual content once loading completes

### Requirement: SSR Style Injection

The system MUST load global styles during SSR to prevent Flash of Unstyled Content (FOUC).

#### Scenario: Server-rendered page styling
- GIVEN a user requests a route directly
- WHEN the server responds with HTML
- THEN the Tailwind stylesheet is embedded in the document `<head>`
- AND the client renders the styled page immediately without FOUC
