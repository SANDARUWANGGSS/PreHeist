# Plan: Authentication Forms

## Context

The `/login` and `/signup` pages are currently empty shells with only a heading. This plan implements the forms described in `_specs/authentication-forms.md`: email + password fields, a password visibility toggle, a submit button, and a link to switch between the two pages. Submitted data is logged to the console only — no backend integration yet.

---

## Approach

Create a single shared `AuthForm` component that accepts a `mode` prop (`"login" | "signup"`). This drives the button label, page title, and switch link — avoiding duplication between the two pages. Both page files simply render `<AuthForm mode="login" />` or `<AuthForm mode="signup" />`.

---

## Status: Implementation Complete

All files have been created/modified. Only verification remains.

**Created:**

- `components/AuthForm/AuthForm.tsx` — controlled form, Eye/EyeOff toggle, console.log on submit, switch link
- `components/AuthForm/AuthForm.module.css` — scoped styles using theme tokens
- `components/AuthForm/index.ts` — barrel export
- `tests/components/AuthForm.test.tsx` — 8 test cases

**Modified:**

- `app/(public)/login/page.tsx` — renders `<AuthForm mode="login" />`
- `app/(public)/signup/page.tsx` — renders `<AuthForm mode="signup" />`

---

## Verification

1. `npm run dev` — visit `/login` and `/signup`, confirm forms render
2. Type into fields and submit — confirm `{ email, password }` appears in the browser console
3. Click the eye icon — confirm password characters toggle visible/hidden
4. Click the switch link — confirm navigation between the two pages
5. `npm test` — all `AuthForm.test.tsx` cases pass
6. `npm run lint` — no lint errors
