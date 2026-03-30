# Spec for use-heists-hook

branch: claude/feature/use-heists-hook

## Summary

Create a `useHeists` custom hook in `hooks/useHeists.ts` that subscribes to real-time Firestore data from the `heists` collection and returns a typed array of `Heist` objects. The hook accepts a mode argument (`'active'`, `'assigned'`, or `'expired'`) to determine which Firestore query to run. Use the hook in `app/(dashboard)/heists/page.tsx` to populate the three sections of the heists dashboard with heist titles.

## Functional Requirements

- The hook is called `useHeists` and lives in `hooks/useHeists.ts`.
- It accepts a single `mode` argument of type `'active' | 'assigned' | 'expired'`.
- It returns an object with `{ heists: Heist[], loading: boolean }`.
- It uses a real-time Firestore listener (`onSnapshot`) so the UI updates automatically when data changes.
- The listener is cleaned up when the component unmounts.
- The current user's uid is read from the `useUser` hook to scope queries.

**Query definitions:**

- `'active'` — heists where `assignedTo === currentUser.uid` and `deadline > now`. These are live missions assigned to the current user.
- `'assigned'` — heists where `createdBy === currentUser.uid`. These are missions the current user has sent out.
- `'expired'` — heists where `deadline < now` and `finalStatus !== null`. These are concluded missions regardless of user, visible to all.

- The heists page (`app/(dashboard)/heists/page.tsx`) uses `useHeists` three times — once per mode — and renders only the `title` of each heist in the corresponding section.
- While loading, each section shows a simple loading indicator.

## Possible Edge Cases

- If the current user is `null` (e.g. auth not yet resolved), the hook should not fire a query and should return an empty array.
- Firestore query errors should be caught and not crash the component; the loading state should resolve to `false`.
- The `deadline` comparison uses `Timestamp` values already stored in Firestore, compared against a client-side `Timestamp.now()`.

## Acceptance Criteria

- `useHeists('active')` returns only heists assigned to the current user with a future deadline.
- `useHeists('assigned')` returns only heists created by the current user.
- `useHeists('expired')` returns all heists with a past deadline and a non-null `finalStatus`.
- All three modes use real-time listeners that update the UI without a page reload.
- The heists page renders the title of each heist under the correct section heading.
- Each section shows a loading state while data is being fetched.

## Open Questions

- Should we validate email format before allowing submission? Light validation
- Should we enforce minimum password length requirements? No.
- Should form inputs persist when navigating between login/signup? No.
- Do we need "Remember me" checkbox on login form? No.
- Should we include "Forgot password" link on login form? No.

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useHeists('active')` subscribes to heists where `assignedTo` matches the current user and `deadline` is in the future.
- `useHeists('assigned')` subscribes to heists where `createdBy` matches the current user.
- `useHeists('expired')` subscribes to heists where `deadline` is in the past and `finalStatus` is not null.
- The hook returns an empty array and does not query Firestore when the user is null.
- The hook cleans up the Firestore listener on unmount.
- The heists page renders heist titles under the correct section headings.
