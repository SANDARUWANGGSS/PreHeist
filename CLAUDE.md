# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint (v9 flat config)
npm test          # Run tests with Vitest
```

To run a single test file: `npx vitest run tests/components/Navbar.test.tsx`

## Architecture

**Pocket Heist** — a Next.js 16 app (React 19) using the App Router with two route groups:

- `app/(public)/` — unauthenticated pages (home, login, signup, preview). Layout wraps in `<main className="public">`.
- `app/(dashboard)/` — protected pages with shared Navbar layout (heists list, create, detail)

Dynamic route: `app/(dashboard)/heists/[id]/` for individual heist detail pages.

**Component conventions:**

- Components live in `components/<ComponentName>/` with three files: `ComponentName.tsx`, `ComponentName.module.css`, and `index.ts` (barrel export)
- Tests mirror source structure under `tests/` (e.g. `tests/components/Avatar.test.tsx`)
- Client components that use hooks must include `'use client'` directive

**Styling:**

- Tailwind CSS 4 (utility-first) + CSS Modules for component-scoped styles
- Custom theme tokens defined in `app/globals.css` inside `@theme {}`: primary `#C27AFF`, secondary `#FB64B6`, dark background palette (`dark`, `light`, `lighter`), success/error colors, heading (white) and body (`#99A1AF`) text
- Font: Inter via Google Fonts
- Global utility classes: `.page-content`, `.center-content`, `.form-title`

**Icons:** `lucide-react` (e.g. `import { Eye } from "lucide-react"`)

**Path alias:** `@/*` resolves to the project root (e.g. `@/components/Navbar`).

## Testing

- Framework: Vitest with `happy-dom` environment and globals enabled
- Assertions: `@testing-library/jest-dom` matchers (e.g. `toBeInTheDocument()`)
- Rendering: `@testing-library/react` — use `render`, `screen`, `fireEvent`
- Setup file: `vitest.setup.ts` imports the jest-dom matchers

## Code Style

- Prettier: no semicolons, single quotes, trailing commas in ES5 positions (`.prettierrc`)
- ESLint extends `next/core-web-vitals` and `next/typescript`

## Checking Documentation

**important** When implementing any lib/framework-specific features, ALWAYS check the appropriate lib/framework documentation using the Context7 MCP server before writing any code.