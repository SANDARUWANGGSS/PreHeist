# Plan: Signup Firebase Integration

## Context

The signup form (`AuthForm` in `mode="signup"`) currently only logs credentials to the console. This plan wires it to Firebase Auth and Firestore: creating an account, generating a heist-themed random codename, setting it as the user's `displayName`, and persisting it (alongside the user's `uid`) to a Firestore `users` document. The login path is untouched.

---

## Files to Create

### `lib/generateCodename.ts` (new)

Pure utility, no imports needed. Three `readonly string[]` constants at module scope:

- `ADJECTIVES` (~18 words): heist-flavoured adjectives, each capitalised. e.g. Swift, Silent, Phantom, Rogue, Cunning, Nimble, Daring, Elusive, Brazen, Covert, Wily, Slick, Veiled, Agile, Sleek, Shadowed, Bold, Stealthy
- `MODIFIERS` (~18 words): colour/material descriptors, each capitalised. e.g. Shadow, Crimson, Iron, Midnight, Cobalt, Silver, Onyx, Scarlet, Ember, Chrome, Obsidian, Steel, Copper, Neon, Azure, Gilt, Ashen, Amber
- `ROLES` (~18 words): heist-role nouns, each capitalised. e.g. Fox, Cipher, Ghost, Raven, Viper, Specter, Wolf, Lynx, Jackal, Shade, Falcon, Wraith, Drifter, Broker, Sentinel, Nomad, Courier, Hawk

Exported function `generateCodename(): string` — picks one random word from each list via `Math.floor(Math.random() * list.length)` and concatenates them. Since all words start uppercase, the result is PascalCase (e.g. `SwiftShadowFox`).

### `tests/lib/generateCodename.test.ts` (new)

Three tests (no JSX, `.ts` extension):

- Returns a non-empty string
- Output matches `/^([A-Z][a-z]+){3}$/` (three capitalised segments joined)
- Calling it 50 times produces more than 1 unique result (verifies randomness)

---

## Files to Modify

### `components/AuthForm/AuthForm.tsx`

**New imports:** `useRouter` from `next/navigation`; `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`; `setDoc`, `doc` from `firebase/firestore`; `auth`, `db` from `@/lib/firebase`; `generateCodename` from `@/lib/generateCodename`.

**New state:** `const [loading, setLoading] = useState(false)` and `const [error, setError] = useState('')`.

**Router:** `const router = useRouter()` at component top level.

**`handleSubmit` changes:**

- Convert to `async function`
- `mode === 'login'` branch: unchanged — still `console.log({ email, password })`
- `mode === 'signup'` branch (try/catch/finally):
  - Set `loading: true`, `error: ''`
  - Await `createUserWithEmailAndPassword(auth, email, password)` → destructure `user`
  - `const codename = generateCodename()`
  - Await `updateProfile(user, { displayName: codename })`
  - Await `setDoc(doc(db, 'users', user.uid), { id: user.uid, codename })`
  - `router.push('/heists')`
  - On catch: `setError('Something went wrong. Please try again.')`
  - Finally: `setLoading(false)`

**JSX changes:**

- Email input: add `disabled={loading}`
- Password input: add `disabled={loading}`
- Password toggle button: add `disabled={loading}`
- Submit button: add `disabled={loading}`, change label to `loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'`
- Between submit button and `<p className={styles.switchText}>`: add `{error && <p className={styles.errorText}>{error}</p>}`

### `components/AuthForm/AuthForm.module.css`

Add `.errorText` class:

- `color: var(--color-error)` (already defined in `globals.css`)
- `font-size: 0.875rem`
- `text-align: center`

Also add `submitButton:disabled` rule: `opacity: 0.5; cursor: not-allowed`

### `tests/components/AuthForm.test.tsx`

Add module mocks at file top (hoisted by Vitest):

- `vi.mock('firebase/auth', ...)` → `{ createUserWithEmailAndPassword: vi.fn(), updateProfile: vi.fn() }`
- `vi.mock('firebase/firestore', ...)` → `{ setDoc: vi.fn(), doc: vi.fn() }`
- `vi.mock('@/lib/firebase', ...)` → `{ auth: {}, db: {} }`
- `vi.mock('next/navigation', ...)` → `{ useRouter: vi.fn(() => ({ push: vi.fn() })) }`
- `vi.mock('@/lib/generateCodename', ...)` → `{ generateCodename: vi.fn().mockReturnValue('TestShadowFox') }`

Add `beforeEach` in the describe block: `vi.clearAllMocks()` + re-set default happy-path resolutions (`createUserWithEmailAndPassword` resolves with `{ user: { uid: 'uid-123' } }`, `updateProfile` and `setDoc` resolve with `undefined`).

**Three new tests:**

1. "disables inputs and submit button while loading" — set `createUserWithEmailAndPassword` to `new Promise(() => {})` (never resolves), fire submit, assert email/password inputs and submit button are `disabled`
2. "displays error message when signup fails" — set `createUserWithEmailAndPassword` to reject, wrap submit in `act(async () => {...})`, assert error paragraph text is present
3. "calls Firebase functions and redirects on successful signup" — wrap interaction in `act(async () => {...})`, fill in fields, submit, assert `createUserWithEmailAndPassword`, `updateProfile`, `setDoc`, and `router.push('/heists')` were called with correct args

All 8 existing tests must remain passing (no changes needed to them).

---

## Reusable Existing Code

- `auth` and `db` from `@/lib/firebase` — do NOT call `getAuth()`/`getFirestore()` again
- `vi.mock` + `vi.mocked()` pattern from `tests/context/AuthContext.test.tsx`
- `act(async () => {...})` pattern for async state updates
- `--color-error` CSS token already defined in `app/globals.css`

---

## Verification

1. `npx vitest run tests/lib/generateCodename.test.ts` — 3 tests pass
2. `npx vitest run tests/components/AuthForm.test.tsx` — 11 tests pass (8 original + 3 new)
3. `npm test` — all 24 tests pass, no regressions
4. `npx tsc --noEmit` — zero type errors
5. `npm run dev` → navigate to `/signup`, submit valid credentials → button disables → redirected to `/heists`
6. Firebase Console: user exists with `displayName` set; Firestore `users/{uid}` doc has `id` + `codename` only (no email)
7. Test error path: submit with an already-registered email → error paragraph appears in form
