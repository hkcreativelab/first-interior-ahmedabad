# Deployment Guide

## Backend: Render

This project includes a Render service configuration in `backend/render.yaml`.

### What to deploy
- Directory: `backend`
- Service type: `web`
- Environment: `node`
- Build command: `npm install && npm run build`
- Start command: `npm run start`

### Required environment variables
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `SUPABASE_POSTER_BUCKET` — storage bucket name (default: `posters`)
- `PORT` — use `3000`

### Notes
- The backend includes these endpoints:
  - `POST /owner-login`
  - `GET /videos`
  - `POST /videos`
  - `POST /video-poster`
  - `GET /health`

- After deployment, your backend URL will look like `https://<your-render-service>.onrender.com`.
- Use that URL in the frontend build as `VITE_BACKEND_URL`.

## Frontend: Hostinger

The static frontend build output lives in `frontend/dist-hostinger`.

### Build for Hostinger

From `frontend`:
```bash
npm install
npm run build:hostinger
```

Then upload the full contents of `frontend/dist-hostinger` to your Hostinger website root.

### Set the backend URL for production

Before building the frontend for Hostinger, set the production backend URL:
```bash
cd frontend
npx cross-env VITE_BACKEND_URL=https://<your-render-service>.onrender.com npm run build:hostinger
```

If you already have `cross-env` installed, you can also run:
```bash
npm run build:render
```

### Notes for Hostinger
- Upload `index.html` and the `assets/` folder from `dist-hostinger`.

- A sample `.htaccess` is included in `frontend/dist-hostinger/.htaccess` and will be produced by the build. This file enables SPA client-side routing on Apache/Hostinger.

- Important: Hostinger provides static hosting only. You cannot persist files or run server-side code on Hostinger to make the site "writable" (for example storing uploaded posters or saving video records). For writable features use a remote API/backend (see the Render backend instructions above). Build the frontend with the deployed backend URL so owner-portal actions call the API rather than attempting local-only persistence.

- Upload steps (recommended):

  1. Build the frontend with your production backend URL set:

  ```bash
  cd frontend
  npx cross-env VITE_BACKEND_URL=https://<your-render-service>.onrender.com npm run build:hostinger
  ```

  2. Upload the contents of `frontend/dist-hostinger` to Hostinger via the File Manager or FTP (Hostinger control panel provides FTP credentials).

  3. Verify `.htaccess` exists in the site root (it enables SPA fallback). If your Hostinger plan manages rewrites in the control panel, follow their docs to enable SPA routing.

  4. Test the owner portal and video upload features — they require the backend to be deployed and reachable from the frontend.

## Recommended workflow

1. Deploy backend to Render first.
2. Copy the backend service URL.
3. Build the frontend with `VITE_BACKEND_URL=https://<your-render-service>.onrender.com`.
4. Upload `frontend/dist-hostinger` to Hostinger.

## Local verification

- Frontend build verified: `npm run build:render` succeeds in `frontend`
- Backend build verified: `npm run build` succeeds in `backend`

## Files created/updated

- `backend/render.yaml`
- `render.yaml`
- `DEPLOYMENT.md`
- `frontend/.env.example`
