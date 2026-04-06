# Spec for heist-card-component

branch: claude/feature/heist-card-component
figma_component (if used): N/A

## Summary

Build a `HeistCard` component to display individual heist details in a card format, and a `HeistCardSkeleton` loading placeholder that matches the same layout. Both are rendered in a 3-column grid on the `/heists` dashboard page. Only active and assigned heists are shown — expired heists are filtered out. Each card title links to the heist detail page (`/heists/:id`), which should exist as an empty route placeholder only.

## Functional Requirements

- `HeistCard` receives a single heist object as a prop and renders its details
- Display the following heist fields on the card: title (as a link), status badge, target, payout, and operative count
- Card title must be an anchor linking to `/heists/:id`
- Only heists with status `active` or `assigned` are displayed; heists with status `expired` are excluded before rendering
- Filtering logic lives in the `/heists` page, not inside `HeistCard`
- `HeistCardSkeleton` renders a placeholder card with the same dimensions and layout as `HeistCard`, using an animated shimmer effect
- Both `HeistCard` and `HeistCardSkeleton` are rendered in a 3-column responsive grid on the `/heists` dashboard page
- While heists are loading (`isLoading` state from `useHeists`), render a fixed number of `HeistCardSkeleton` placeholders (e.g. 6) in the grid
- Once loaded, replace skeletons with filtered `HeistCard` components
- The `/heists/:id` detail route must exist as an empty page placeholder — no content required yet

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- No heists match the active/assigned filter — show an empty state message (e.g. "No active heists found")
- All heists are expired — same empty state as above
- Heist data is still loading — show skeleton grid
- A heist is missing optional fields (e.g. no operatives assigned) — card must render gracefully without crashing
- Very long heist titles — titles should truncate or wrap without breaking layout

## Acceptance Criteria

- `HeistCard` renders title, status, target, payout, and operative count for a given heist
- The heist title is a Next.js `Link` pointing to `/heists/:id`
- The `/heists` page filters out expired heists before passing data to `HeistCard`
- `HeistCardSkeleton` is visually similar in size/shape to `HeistCard` and includes a shimmer animation
- The `/heists` page shows skeletons while loading and real cards once data is available
- Cards are displayed in a 3-column grid layout
- The `/heists/:id` route exists and renders without errors (empty content is acceptable)
- No TypeScript errors or lint warnings introduced

## Open Questions

- How many skeleton cards should be shown while loading? Suggest 6 (2 rows × 3 columns).
- Should the status badge use distinct colours per status (active, assigned)? Suggest yes, using theme tokens.
- Should the empty state include a CTA button (e.g. "Create a Heist")? Defer to future spec.
- Should operative count show names or just a number? Just a number for now.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `HeistCard` renders the heist title, status, target, and payout correctly
- `HeistCard` title renders as a link pointing to `/heists/:id`
- `HeistCardSkeleton` renders without errors
- The `/heists` page filters out expired heists and does not render cards for them
- The `/heists` page renders skeletons when `isLoading` is true
- The `/heists` page renders an empty state when no active/assigned heists exist
