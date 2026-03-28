# Plan: Auth State Management (`useUser` hook)

## Context

The app has Firebase Auth configured (`lib/firebase.ts` exports `auth`) but no global state for the current user. Components have no way to know if a user is logged in. This plan introduces a real-time auth state listener via a React context + `useUser` hook, so any page or component can read `user` and `loading` without prop drilling.

No login/signup/logout UI is in scope — only the listener infrastructure.

---

## Files to Create

### `context/AuthContext.tsx` (new)

Client component (`'use client'` as first line). Contains three things:

1. **Context object** — `createContext` with a default of `null`, typed as `{ user: User | null; loading: boolean } | null`
2. **`AuthProvider` component** — accepts `{ children: React.ReactNode }`:
   - State: `user: User | null` (init `null`), `loading: boolean` (init `true`)
   - `useEffect` with empty deps: calls `onAuthStateChanged(auth, callback)` from `firebase/auth`, using the `auth` singleton from `@/lib/firebase`. Callback sets `user` and flips `loading` to `false`. Returns unsubscribe as cleanup.
   - Renders `<AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>`
3. **`useUser` hook** — calls `useContext(AuthContext)`. Throws `Error("useUser must be used within an AuthProvider")` if result is `null`. Otherwise returns `{ user, loading }`.

### `tests/context/AuthContext.test.tsx` (new)

Mock strategy:

- `vi.mock('firebase/auth')` — mock `onAuthStateChanged` to immediately invoke its callback with a controlled value and return a stub unsubscribe fn
- `vi.mock('@/lib/firebase', () => ({ auth: {} }))` — prevent real SDK calls

Test cases:

- `useUser` returns `{ user: null, loading: false }` when callback fires with `null`
- `useUser` returns `{ user: <User>, loading: false }` when callback fires with a user object
- `loading` is `true` before the callback fires
- Unsubscribe function is called on unmount
- `useUser` throws with expected message when called outside `AuthProvider` (suppress console.error with `vi.spyOn`)

Use `renderHook` with `wrapper: AuthProvider` from `@testing-library/react`.

---

## Files to Modify

### `app/layout.tsx`

- Add import: `import AuthProvider from '@/context/AuthContext'`
- Wrap `{children}` with `<AuthProvider>{children}</AuthProvider>`
- File stays a server component — no `'use client'` added

---

## Reusable Existing Code

- `auth` singleton from `@/lib/firebase` — import directly, do not call `getAuth()` again
- `onAuthStateChanged`, `User` type — from `firebase/auth`
- `vi.spyOn(console, 'error').mockImplementation(...)` — pattern already used in `tests/components/AuthForm.test.tsx`
- `renderHook` — already available via `@testing-library/react` v16.3.0

---

## Verification

1. `npx tsc --noEmit` — zero type errors
2. `npx vitest run tests/context/AuthContext.test.tsx` — all tests pass
3. `npm test` — no regressions in existing tests
4. `npm run dev` — React DevTools shows `AuthProvider` wrapping the tree inside `<body>`, no console errors
