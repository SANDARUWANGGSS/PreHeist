# Spec for login-form

branch: claude/feature/login-form

## Summary

Wire the existing login form (`AuthForm` in `app/(public)/login/`) to Firebase Authentication. When a user submits valid credentials, they are signed in and shown a success message in the form. No redirect is required after login.

## Functional Requirements

- The login form submits email and password to Firebase Auth using `signInWithEmailAndPassword`.
- On successful login, a success message is displayed in the form (e.g. "Logged in successfully!").
- On failure, a user-friendly error message is displayed (e.g. "Invalid email or password.").
- The form displays a loading/disabled state while the sign-in request is in progress.
- Submitting the form multiple times while loading should be prevented.
- No page redirect occurs after login — the success state is shown inline.

## Possible Edge Cases

- Invalid credentials should surface a clear error without exposing internal Firebase error codes to the user.
- Network failures or other unexpected errors should be caught and shown as a generic error message.
- The form should re-enable after a failed attempt so the user can try again.

## Acceptance Criteria

- Submitting correct credentials signs the user in via Firebase Auth.
- A success message is visible in the form after successful login.
- An error message is visible in the form after a failed login attempt.
- The form is disabled while submission is in progress.
- No redirect occurs on success.

## Open Questions

- Should we validate email format before allowing submission? Light validation
- Should we enforce minimum password length requirements? No.
- Should form inputs persist when navigating between login/signup? No.
- Do we need "Remember me" checkbox on login form? No.
- Should we include "Forgot password" link on login form? No.
- Should the success message replace the form, or appear alongside it?

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The login form calls `signInWithEmailAndPassword` with the entered credentials on submit.
- A success message is shown after a successful login.
- An error message is shown when Firebase returns an authentication error.
- The form is disabled while submission is in progress.
