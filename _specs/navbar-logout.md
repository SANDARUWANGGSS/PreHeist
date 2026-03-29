# Spec for navbar-logout

branch: claude/feature/navbar-logout

## Summary

Add a logout button to the Navbar component that signs the current user out of Firebase when clicked. The button is only visible when a user is authenticated. No redirect behaviour is required after logout.

## Functional Requirements

- The Navbar displays a logout button when a user is currently signed in.
- The logout button is hidden when no user is authenticated.
- Clicking the logout button calls Firebase's sign-out function to end the session.
- The `useUser` hook (from `context/AuthContext`) is used to determine the current auth state.
- No page redirect occurs after logout — the UI simply reflects the updated auth state.

## Possible Edge Cases

- The sign-out call may fail — any error should be handled gracefully without crashing the component.
- The button should not be clickable while a sign-out is in progress to prevent duplicate calls.

## Acceptance Criteria

- A logout button is visible in the Navbar when a user is logged in.
- No logout button is visible when no user is logged in.
- Clicking the button signs the user out via Firebase Auth.
- After logout, the button disappears (auth state updates via the existing `onAuthStateChanged` listener).
- No redirect happens after logout.

## Open Questions

- Should we validate email format before allowing submission? Light validation
- Should we enforce minimum password length requirements? No.
- Should form inputs persist when navigating between login/signup? No.
- Do we need "Remember me" checkbox on login form? No.
- Should we include "Forgot password" link on login form? No.

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Logout button is not rendered when user is null.
- Logout button is rendered when a user is logged in.
- Clicking the logout button calls the Firebase sign-out function.
- Sign-out errors are handled without crashing.
