# Spec for route-protection

branch: claude/feature/route-protection

## Summary

Add route protection to the two layout groups so that unauthenticated users cannot access dashboard pages and authenticated users cannot access public pages. Both group layouts should show a minimal loading indicator while Firebase resolves the current auth state, before any redirect occurs.

## Functional Requirements

- Pages in `app/(dashboard)/` are only accessible to authenticated users. Unauthenticated users are redirected to `/login`.
- Pages in `app/(public)/` are only accessible to unauthenticated users. Authenticated users are redirected to `/heists`.
- Both group layouts use the `useUser` hook to read `user` and `loading` from auth context.
- While `loading` is `true` (auth state not yet resolved), a simple loading indicator is shown in place of the page content — no redirect occurs yet.
- Once `loading` is `false`, the redirect fires if the user does not meet the access requirement; otherwise the children are rendered.

## Possible Edge Cases

- On first load, Firebase takes a moment to resolve auth state — the loader prevents a flash of wrong content or a premature redirect.
- A logged-in user navigating directly to `/login` or `/signup` should be bounced to `/heists`.
- A logged-out user navigating directly to any `/heists` route should be bounced to `/login`.
- The loader should not persist indefinitely — it only shows while `loading === true`.

## Acceptance Criteria

- Visiting any `(dashboard)` route while logged out redirects to `/login`.
- Visiting any `(public)` route while logged in redirects to `/heists`.
- A loading indicator is visible briefly while auth state is being resolved on both route groups.
- Once auth state resolves and the user has access, the page content renders normally.
- No flash of protected content occurs before the redirect.

## Open Questions

- Should we validate email format before allowing submission? Light validation
- Should we enforce minimum password length requirements? No.
- Should form inputs persist when navigating between login/signup? No.
- Do we need "Remember me" checkbox on login form? No.
- Should we include "Forgot password" link on login form? No.

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The dashboard layout redirects to `/login` when the user is not authenticated.
- The dashboard layout renders children when the user is authenticated.
- The public layout redirects to `/heists` when the user is authenticated.
- The public layout renders children when the user is not authenticated.
- Both layouts show a loading indicator while auth state is unresolved.
