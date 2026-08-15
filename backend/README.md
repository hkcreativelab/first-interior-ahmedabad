# Backend README — Supabase & deployment

This document explains how to prepare Supabase for the backend and how to deploy the backend service.

1) Create Supabase project
- Sign in at https://app.supabase.com and create a new project.
- In the project dashboard open **SQL Editor** and run the SQL below to create the required tables:

```sql
create extension if not exists pgcrypto;

create table if not exists owner_users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  password text not null
);

create table if not exists videos (
  id text primary key,
  title text not null,
  description text not null,
  url text not null,
  thumbnail text,
  views text,
  comments text
);
```

2) Storage bucket for posters
- In the Supabase sidebar click **Storage** → **Create a new bucket**. Use the name `posters` and make it public if you want direct public URLs.

3) Create an owner user
- Use the SQL editor to insert an owner user for the admin portal (or use your own tooling):

```sql
insert into owner_users (username, password) values ('owner', 'a-strong-password');
```

4) Get Supabase credentials
- In Supabase dashboard go to **Settings → API** and copy:
  - `SUPABASE_URL` (the project URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (service role key — keep secret)

5) Environment variables for Render (or other host)
- Set these environment variables in your host's UI (Render specific keys shown):

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key
- `SUPABASE_POSTER_BUCKET` — `posters` (default)
- `PORT` — `3000`
- Optional local fallback (development only):
  - `OWNER_USERNAME` and `OWNER_PASSWORD` — only if you want a simple dev fallback for owner login

6) Deploying to Render
- The repository includes `render.yaml` at the repo root. Use Render's "New Web Service" and connect your repo — Render will use `render.yaml` to create the service.
- In Render dashboard add the environment variables listed above.
- Deploy and then check the health endpoint:

```bash
curl https://<your-render-service>/health
```

7) Local testing
- You can run the backend locally by setting environment variables and running:
```bash
cd backend
# On PowerShell (example):
$env:SUPABASE_URL='https://...'
$env:SUPABASE_SERVICE_ROLE_KEY='...'
npm run dev
```

8) Notes & security
- Never commit the `SUPABASE_SERVICE_ROLE_KEY` to git — keep it as a secret in the host environment.
- Using plain-text passwords in `owner_users` is quick for demonstration, but consider storing hashed passwords (e.g., bcrypt) for production.
