# Neon Database Setup

## 1. Create the database

1. Go to https://console.neon.tech and sign in.
2. Click **New Project**.
3. Choose a project name, for example `uyisenga-website`.
4. Choose the closest region to your users.
5. Click **Create Project**.

## 2. Copy your connection string

1. In the Neon project dashboard, open **Connection Details**.
2. Choose **Pooled connection** for online hosting.
3. Copy the connection string. It looks like:

```txt
postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
```

## 3. Create the tables and starter data

1. In Neon, open **SQL Editor**.
2. Paste everything from `db/schema.sql` and run it.
3. Paste everything from `db/seed.sql` and run it.

The default admin login from the seed is:

```txt
Email: admin@uyisenganimanzi.org.rw
Password: UnmAdmin123!
```

Change this password before going live by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your hosting environment.

## 4. Add environment variables locally

Create a `.env` file from `.env.example` and fill in your real values:

```txt
DATABASE_URL="your-neon-pooled-connection-string"
ADMIN_EMAIL="admin@uyisenganimanzi.org.rw"
ADMIN_PASSWORD="your-new-password"
ADMIN_SESSION_SECRET="make-this-a-long-random-secret"
```

## 5. Add secrets when deploying

For Cloudflare Workers, run:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

Paste each value when Wrangler asks.

## 6. Run the website

```bash
npm run dev
```

Open `/login`, sign in, then edit Team, Programs, Gallery, Press Room, Programs Page, and Content. Those changes now save to Neon.
