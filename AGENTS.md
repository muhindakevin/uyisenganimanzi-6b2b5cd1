# Architecture rules
- The shared header loads program menu entries from the existing public programs endpoint so navigation follows admin-managed content.
- News URLs use a shared title-and-ID slug helper; numeric legacy URLs redirect to the canonical slug so existing shares stay valid.
- News details load through a public server function with a non-persistent publishable database client using server runtime configuration (never browser VITE configuration) and TanStack Query, so published articles render in initial HTML without privileged access or a preview proxy dependency.- No global bearer-token function middleware in src/start.ts: admin auth is the app's own session, and a browser database client there breaks client-side server-function calls on the published site.

- Homepage and program listing reuse ProgramCard so program previews remain consistent and use admin-managed content.
- Load the shared website font in the root head and define its families in global theme tokens so every page uses the same typography.
