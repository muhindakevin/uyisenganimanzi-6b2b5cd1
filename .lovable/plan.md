
## Goal

Everything visible on the public site becomes admin-editable. The admin dashboard is the single source of truth; no visible copy is baked into the code. The `/admin` route stays behind an email + password login.

## Security (already done this turn)

- `/admin` route is guarded — no token → redirected to `/login`.
- Login page no longer pre-fills the email.
- Removed hardcoded fallback admin email/password hash from `src/routes/api/auth.ts`. Only `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars (already set) or the `admin_users` table can log in.

## Content architecture

All page copy is stored as JSON blobs in the existing `site_content` table under one key per page:

```text
home         → hero, stats, mission preview, programs preview, CTA
about        → intro, story, values, milestones
about.team   → intro/heading (team rows stay in team_members)
about.mission → mission, vision, principles
about.impact  → stats, testimonials, sections
about.approach → phases, principles
about.beneficiaries → groups
programs.page → page heading, intro, empty state (programs list stays in programs table)
gallery.page  → page heading, intro (items stay in gallery_items)
press.page    → page headings per category
contact       → address, email, phone, hours, map embed, social links
footer        → tagline, columns, legal, socials
donate        → heading, methods, bank/mobile details, CTA
get-involved  → heading, ways to help
```

The `site_content` table already exists with public SELECT + admin-only write policies, so no schema migration is needed — we just add rows.

## Frontend refactor

For each public route:
1. Loader calls the public `getSiteContent` server fn (already exists) with the route's key.
2. Component reads content from loader data — no string literals for user-visible copy.
3. Defaults live in a `src/frontend/content/defaults.ts` module used only as a first-run seed shipped to admin; the running app always reads from the DB.

## Admin dashboard

Extend `src/routes/admin.tsx` with one editor tab per page key. Each tab is a form bound to the JSON blob; on Save it PUTs `/api/content` (already wired). Rich-text fields use `<Textarea>`, lists use add/remove rows, images use URL inputs.

## Rollout

- Turn 1 (this turn): security fixes ✅ + this plan.
- Turn 2: Home + Footer + Contact + Donate + Get-involved content keys, loaders, admin tabs.
- Turn 3: All About subpages (Story, Mission/Vision, Impact, Approach, Beneficiaries).
- Turn 4: Programs page copy, Gallery page copy, Press Room page copy (item lists already admin-managed).
- Turn 5: Seed initial `site_content` rows from current copy so nothing looks empty on first load, then verify each page renders from DB.

## Technical notes

- `getSiteContent` returns the full content map; we'll add a lightweight `getSiteContentKey(key)` server fn to fetch a single blob to avoid over-fetching.
- Admin forms use controlled inputs + a single Save button per section.
- No RLS changes needed; policies from the earlier security pass already restrict writes to admin.
- Images referenced in blobs stay as URLs (existing Lovable Cloud storage or external).
