# Plan: Navbar Logout Button

## Context

The Navbar is currently a static server component with no auth awareness. Users have no way to sign out after logging in. This plan adds a logout button that is conditionally rendered based on the auth state from `useUser`, and calls Firebase's `signOut` when clicked.

---

## Files to Modify

### `components/Navbar/Navbar.tsx`

- Add `'use client'` directive as first line (required for `useUser` hook)
- New imports: `useUser` from `@/context/AuthContext`; `signOut` from `firebase/auth`; `auth` from `@/lib/firebase`
- Add `loading` state: `const [signingOut, setSigningOut] = useState(false)`
- Read auth state: `const { user } = useUser()`
- Add async `handleLogout` function: sets `signingOut: true`, calls `await signOut(auth)`, sets `signingOut: false` in finally. Catches errors silently (no crash)
- In JSX: inside the `<ul>`, add a `<li>` containing a `<button>` that:
  - Only renders when `user !== null`: `{user && <li>...</li>}`
  - Has `onClick={handleLogout}` and `disabled={signingOut}`
  - Label: `signingOut ? 'Signing out...' : 'Logout'`
  - Uses `className={styles.logoutButton}`

### `components/Navbar/Navbar.module.css`

- Add `.logoutButton` class: minimal button reset (no background, no border), matching the nav link style (same font size, colour as body text), cursor pointer, with a hover colour change

### `tests/components/Navbar.test.tsx`

- Add imports: `vi`, `beforeEach`, `fireEvent` from vitest/testing-library
- Add module mocks:
  - `vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))`
  - `vi.mock('firebase/auth', () => ({ signOut: vi.fn() }))`
  - `vi.mock('@/lib/firebase', () => ({ auth: {} }))`
- `beforeEach`: `vi.clearAllMocks()`; set default `useUser` return to `{ user: null, loading: false }`

**New tests:**

1. "does not render logout button when user is null" — assert `queryByRole('button', { name: /logout/i })` is `null`
2. "renders logout button when user is logged in" — set `useUser` to return `{ user: { uid: 'abc' }, loading: false }`, assert button is in the document
3. "calls signOut when logout button is clicked" — mock `signOut` to resolve, click button, assert `signOut` was called with `auth`
4. "does not crash when signOut fails" — mock `signOut` to reject, click button, assert no throw and component still renders

All 2 existing tests must keep passing (they render with `user: null` by default so no button appears).

---

## Reusable Existing Code

- `useUser` from `@/context/AuthContext` — already provides `user` and `loading`
- `auth` singleton from `@/lib/firebase` — pass to `signOut(auth)`
- `vi.mock` + `beforeEach` pattern from `tests/components/AuthForm.test.tsx`

---

## Verification

1. `npx vitest run tests/components/Navbar.test.tsx` — all tests pass (2 existing + 4 new)
2. `npm test` — no regressions across all test files
3. `npx tsc --noEmit` — zero type errors
4. `npm run dev` — log in via `/signup`, navigate to `/heists`, confirm logout button appears in navbar; click it, confirm button disappears
