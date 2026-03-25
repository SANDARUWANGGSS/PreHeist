# Authentication Forms

## Overview

Add fully functional login and signup forms to the `/login` and `/signup` pages. Each form collects an email and password, includes a toggle to show/hide the password, and submits by logging the form data to the console. Users can easily navigate between the two forms via a switch link.

---

## Goals

- Provide a login form on `/login` and a signup form on `/signup`
- Allow users to toggle password visibility within each form
- Log submitted form data to the browser console (no backend integration yet)
- Make it easy for users to switch between the login and signup forms

---

## Pages Affected

- `app/(public)/login/page.tsx`
- `app/(public)/signup/page.tsx` (assumed to exist or to be created)

---

## Features

### 1. Email Field

- Standard email input
- Labelled clearly (e.g. "Email")
- `type="email"` for browser-native validation

### 2. Password Field

- Standard password input
- Labelled clearly (e.g. "Password")
- `type="password"` by default (characters hidden)
- Includes a toggle icon button to show/hide the password
  - When hidden: show an "eye" icon to reveal
  - When visible: show an "eye-off" icon to hide

### 3. Submit Button

- Login page: button labelled **"Login"**
- Signup page: button labelled **"Sign Up"**
- On submit: prevent default form behaviour and log `{ email, password }` to the console

### 4. Switch Between Forms

- Login page: a link/button below the form — e.g. _"Don't have an account? Sign up"_ — navigates to `/signup`
- Signup page: a link/button below the form — e.g. _"Already have an account? Login"_ — navigates to `/login`

---

## Behaviour

| Action                            | Result                             |
| --------------------------------- | ---------------------------------- |
| User submits login form           | `console.log({ email, password })` |
| User submits signup form          | `console.log({ email, password })` |
| User clicks password toggle       | Password characters shown/hidden   |
| User clicks switch link on login  | Navigates to `/signup`             |
| User clicks switch link on signup | Navigates to `/login`              |

---

## Out of Scope

- Backend API calls or authentication logic
- Form validation beyond browser-native email validation
- Error messages or loading states
- "Forgot password" flow
- Third-party OAuth (Google, GitHub, etc.)

---

## Acceptance Criteria

- [ ] Login page at `/login` renders an email field, password field, show/hide toggle, and a "Login" submit button
- [ ] Signup page at `/signup` renders an email field, password field, show/hide toggle, and a "Sign Up" submit button
- [ ] Submitting either form logs `{ email, password }` to the browser console
- [ ] The password toggle correctly switches between visible and hidden states
- [ ] Each page has a clearly visible link to switch to the other form
- [ ] Forms are styled consistently with the existing app theme
