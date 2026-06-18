# cPanel Deployment

This project is a Node.js app, not a plain static HTML upload.

## Upload

1. Upload `uyisenganimanzi-cpanel.zip` to your hosting account.
2. Extract it into a folder outside `public_html`, for example `uyisenganimanzi`.
3. In cPanel, open **Setup Node.js App**.
4. Create an app with:
   - Node.js version: `22` if available, otherwise the newest available version
   - Application root: the extracted folder
   - Application URL: your domain
   - Application startup file: `server.prod.js`
5. Run **NPM Install** from cPanel.
6. Add environment variables from your `.env` or hosting settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`
   - `ADMIN_SESSION_SECRET`
7. Start or restart the Node.js app.

## Notes

- Do not upload only `dist/client` to `public_html`; API routes and admin features need the Node server.
- If your cPanel does not support Node.js apps, use a host such as Render, Railway, Vercel, or Cloudflare Workers/Pages instead.
