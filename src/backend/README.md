# Backend

This folder contains server-side code:

- `index.ts` - database access, admin auth helpers, API business logic, and fallback data access
- `seed-data.json` - fallback content used when the database environment is missing

API route files stay in `src/routes/api` because TanStack Router uses route files to expose server handlers. Those API routes import backend functions from `@/backend`.

Secrets such as `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and admin credentials must stay in `.env` locally or hosting environment variables. Do not commit or upload `.env` publicly.
