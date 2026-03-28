# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run tests with Vitest
```

To run a single test file: `npx vitest run tests/components/Navbar.test.tsx`

## Architecture

**Pocket Heist** — a Next.js 16 app using the App Router with two route groups:

- `app/(public)/` — unauthenticated pages (home, login, signup, preview)
- `app/(dashboard)/` — protected pages with shared Navbar layout (heists list, create, detail)

Dynamic route: `app/(dashboard)/heists/[id]/` for individual heist detail pages.

**Component conventions:**
- Components live in `components/<ComponentName>/` with three files: `ComponentName.tsx`, `ComponentName.module.css`, and `index.ts` (barrel export)
- Tests mirror source structure under `tests/`

**Styling:**
- Tailwind CSS 4 (utility-first) + CSS Modules for component-scoped styles
- Custom theme tokens defined in `app/globals.css` inside `@theme {}`: primary `#C27AFF`, secondary `#FB64B6`, dark background palette, success/error colors
- Font: Inter via Google Fonts

**Path alias:** `@/*` resolves to the project root (e.g. `@/components/Navbar`).
