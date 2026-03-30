# Spec for create-heist-form

branch: claude/feature/create-heist-form

## Summary

Build the Create Heist form at `app/(dashboard)/heists/create/page.tsx`. When submitted, the form writes a new document to the Firestore `heists` collection using the `CreateHeistInput` interface, then redirects the user to `/heists`. The `createdAt` and `deadline` fields are set programmatically (deadline = 48 hours from submission). The `assignedTo` and `assignedToCodename` fields are populated by fetching the list of operatives from the Firestore `users` collection.

## Functional Requirements

- The form contains the following user-editable fields:
  - `title` — text input, required
  - `description` — textarea, required
  - `assignedTo` — dropdown of available operatives fetched from the `users` collection (stores the selected user's `uid`)
  - `assignedToCodename` — automatically derived from the selected operative (not a separate input)
- The `createdBy` and `createdByCodename` fields are sourced from the currently logged-in user via the `useUser` hook and their `users` document.
- The `createdAt` field is set to `serverTimestamp()` at submission time.
- The `deadline` field is set to a Firestore `Timestamp` 48 hours from the current time at submission.
- The `finalStatus` field is set to `null` on creation.
- On successful submission, the user is redirected to `/heists`.
- The form displays a loading/disabled state while the Firestore write is in progress.
- On failure, a user-friendly error message is displayed in the form.
- The operatives list is fetched on mount; a loading state is shown while it loads.

## Possible Edge Cases

- If the `users` collection is empty or fails to load, the assignee dropdown should show a fallback state (e.g. "No operatives available").
- If the current user's document cannot be found, submission should be blocked with a clear error.
- Network errors during document creation should be caught and shown as a generic error message.
- The form should re-enable after a failed submission so the user can retry.

## Acceptance Criteria

- Submitting the form with valid inputs creates a new document in the `heists` Firestore collection.
- The created document contains all required fields matching the `CreateHeistInput` interface.
- `createdAt` is a server timestamp; `deadline` is 48 hours from client submission time; `finalStatus` is `null`.
- After successful submission, the user is redirected to `/heists`.
- The form is disabled while the write is in progress.
- An error message is shown if the write fails.

## Open Questions

- Should we validate email format before allowing submission? Light validation
- Should we enforce minimum password length requirements? No.
- Should form inputs persist when navigating between login/signup? No.
- Do we need "Remember me" checkbox on login form? No.
- Should we include "Forgot password" link on login form? No.

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The form renders title, description, and assignee fields.
- Submitting the form calls `addDoc` with the correct data shape.
- `createdAt` uses `serverTimestamp()` and `deadline` is set to 48 hours from now.
- The form is disabled while submission is in progress.
- An error message is shown when Firestore write fails.
- The user is redirected to `/heists` after successful submission.
