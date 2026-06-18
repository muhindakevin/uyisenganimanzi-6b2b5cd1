# Frontend

This folder contains client-facing code:

- `components/` - layout, shared UI, and reusable page components
- `components/ui/` - base UI primitives
- `assets/` - images and partner logos imported by the app
- `hooks/` - React hooks used by frontend components
- `lib/` - frontend utilities

Page route files stay in `src/routes` because TanStack Router uses that folder for file-based routing. Those route files import UI from this folder.
