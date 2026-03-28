# Spec for auth-state-management

branch: claude/feature/auth-state-management

## Summary

Introduce a global, real-time Firebase auth state listener so any page or component can access the currently authenticated user via a `useUser` hook. The hook returns `null` when no user is logged in and the Firebase `User` object when one is. No login, signup, or logout flows are in scope — only the listener and the hook.

## Functional Requirements

- A React context provider wraps the app and subscribes to Firebase's `onAuthStateChanged` listener on mount, unsubscribing on unmount.
- The context holds the current user state: `User | null`.
- A `useUser` hook exposes the current user value from context to any component or page.
- The user state updates in real time whenever the Firebase auth state changes (e.g. session expiry, manual sign-in/out from elsewhere).
- Any existing component or page that references user data is updated to consume `useUser` instead of any local or prop-based approach.
- The provider must be placed high enough in the component tree that all dashboard and public pages can access it.

## Possible Edge Cases

- Hook called outside the provider should throw a clear error rather than silently returning undefined.
- Auth state may briefly be `null` on first load while Firebase resolves the session — components should handle this loading state gracefully (e.g. not flash logged-out UI).
- Multiple components calling `useUser` simultaneously should all receive the same value without triggering multiple listeners.

## Acceptance Criteria

- `useUser` returns `null` when no user is authenticated.
- `useUser` returns the Firebase `User` object when a user is authenticated.
- Auth state updates propagate to all consumers without a page reload.
- All existing components that previously accessed user data now use `useUser`.
- No login/signup/logout UI or logic is introduced.

## Open Questions

- Should there be an explicit `loading` state returned by `useUser` to distinguish "not yet resolved" from "definitely logged out"?
- Should the provider live in the root layout or only the dashboard layout?

## Testing Guidelines

Create a test file in the `./tests` folder. Write meaningful tests for:

- `useUser` returns `null` when auth state is unauthenticated.
- `useUser` returns a user object when auth state is authenticated.
- Calling `useUser` outside the provider throws an error.
- Components consuming `useUser` re-render when auth state changes.
