# Plan: Login Form

## Context

The login branch of `AuthForm` currently stubs out login with a `console.log`. This plan wires it to Firebase Auth using `signInWithEmailAndPassword`, displays a success message inline on success, and surfaces a user-friendly error on failure — with no redirect.

---

## Files to Modify

### `components/AuthForm/AuthForm.tsx`

- Add `signInWithEmailAndPassword` to the `firebase/auth` import
- Add `success` state: `const [success, setSuccess] = useState('')`
- Replace the login branch in `handleSubmit` (remove `console.log`):
  - `setLoading(true)`, `setError('')`, `setSuccess('')`
  - `await signInWithEmailAndPassword(auth, email, password)`
  - On success: `setSuccess('Logged in successfully!')`
  - On failure: `setError('Invalid email or password.')`
  - `finally`: `setLoading(false)`
- In JSX: add `{success && <p className={styles.successText}>{success}</p>}` after the `{error && ...}` line
- Email format validation is already handled by `type="email"` on the input (light validation per spec)

### `components/AuthForm/AuthForm.module.css`

- Add `.successText` class mirroring `.errorText` but using `var(--color-success)` instead of `var(--color-error)`

### `tests/components/AuthForm.test.tsx`

- Add `signInWithEmailAndPassword: vi.fn()` to the `firebase/auth` mock
- Import and create `mockSignIn = vi.mocked(signInWithEmailAndPassword)`
- In `beforeEach`: `mockSignIn.mockResolvedValue({ user: { uid: 'uid-123' } } as any)`
- Remove the test **"logs email and password to console on submit"** — this behaviour is being replaced
- Add new tests:
  1. `"calls signInWithEmailAndPassword with the entered credentials on submit"` — mock resolves, fill inputs, submit, assert `mockSignIn` called with `{}`, email, password
  2. `"shows a success message after a successful login"` — mock resolves, submit, assert `"Logged in successfully!"` visible
  3. `"shows an error message when Firebase returns an auth error"` — mock rejects, submit, assert `"Invalid email or password."` visible
  4. `"disables the form while login is in progress"` — mock returns pending promise, submit, assert inputs and button are disabled

---

## Reusable Existing Code

- `auth` singleton from `@/lib/firebase` — already imported, pass to `signInWithEmailAndPassword(auth, email, password)`
- `loading` / `error` state + `setLoading` / `setError` — already in the component, reuse as-is
- `.errorText` CSS class in `AuthForm.module.css` — mirror for `.successText`
- `act` + `fireEvent` + `vi.mock` pattern from existing `AuthForm.test.tsx`

---

## Verification

1. `npx vitest run tests/components/AuthForm.test.tsx` — all tests pass (existing minus removed stub test + 4 new)
2. `npm test` — no regressions across all test files
3. `npx tsc --noEmit` — zero type errors
4. `npm run dev` — navigate to `/login`, submit valid credentials, confirm success message appears inline; submit bad credentials, confirm error message appears; confirm no redirect in either case
