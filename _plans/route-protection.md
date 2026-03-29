# Plan: Route Protection

## Context

Both route group layouts are currently static server components with no auth awareness. Any user can visit any route regardless of their login state. This plan converts both layouts to client components, uses `useUser` to gate access, and shows a minimal loader while Firebase resolves the initial auth state to prevent flashes of wrong content.

---

## Files to Modify

### `app/(dashboard)/layout.tsx`

- Add `'use client'` directive
- Import `useEffect` from `react`; `useRouter` from `next/navigation`; `useUser` from `@/context/AuthContext`
- Inside the component:
  - `const { user, loading } = useUser()`
  - `const router = useRouter()`
  - `useEffect`: when `!loading && !user`, call `router.replace('/login')`
- Return a loader element while `loading === true`
- Return `null` while `!loading && !user` (redirect is in flight)
- Otherwise render the existing layout: `<Navbar />` + `<main>{children}</main>`

### `app/(public)/layout.tsx`

- Add `'use client'` directive
- Import `useEffect` from `react`; `useRouter` from `next/navigation`; `useUser` from `@/context/AuthContext`
- Inside the component:
  - `const { user, loading } = useUser()`
  - `const router = useRouter()`
  - `useEffect`: when `!loading && user`, call `router.replace('/heists')`
- Return a loader element while `loading === true`
- Return `null` while `!loading && user` (redirect is in flight)
- Otherwise render: `<main className="public">{children}</main>`

### Loader

Both layouts render the same minimal loader — a full-screen centered `<div>` with `"Loading..."` text, using Tailwind utility classes (`min-h-screen flex items-center justify-center`). No new component or CSS file needed.

### `tests/layouts/dashboard.test.tsx` _(new file)_

- Mock `@/context/AuthContext` (`useUser`), `next/navigation` (`useRouter` with `replace: vi.fn()`), `@/components/Navbar` (return `null`)
- Tests:
  1. `"shows loader while auth state is loading"` — `loading: true`, assert loader text visible
  2. `"renders children when user is authenticated"` — `loading: false, user: { uid: 'abc' }`, assert children rendered
  3. `"redirects to /login when user is not authenticated"` — `loading: false, user: null`, assert `mockReplace` called with `'/login'`
  4. `"renders nothing while redirect is in flight"` — `loading: false, user: null`, assert children not rendered

### `tests/layouts/public.test.tsx` _(new file)_

- Same mock setup
- Tests:
  1. `"shows loader while auth state is loading"` — `loading: true`, assert loader text visible
  2. `"renders children when user is not authenticated"` — `loading: false, user: null`, assert children rendered
  3. `"redirects to /heists when user is authenticated"` — `loading: false, user: { uid: 'abc' }`, assert `mockReplace` called with `'/heists'`
  4. `"renders nothing while redirect is in flight"` — `loading: false, user: { uid: 'abc' }`, assert children not rendered

---

## Reusable Existing Code

- `useUser` from `@/context/AuthContext` — already provides `user` and `loading`
- `vi.mock` + `beforeEach` pattern from `tests/components/Navbar.test.tsx`
- `useRouter` mock pattern (`{ replace: vi.fn() }`) — same shape as `{ push: vi.fn() }` used in `AuthForm.test.tsx`

---

## Verification

1. `npx vitest run tests/layouts/` — all 8 new tests pass
2. `npm test` — no regressions across all test files
3. `npx tsc --noEmit` — zero type errors
4. `npm run dev`:
   - Logged out: visit `/heists` → redirected to `/login` ✓
   - Logged out: visit `/login` → page renders normally ✓
   - Logged in: visit `/heists` → page renders normally ✓
   - Logged in: visit `/login` → redirected to `/heists` ✓
   - On first load, loader flashes briefly before content appears ✓
