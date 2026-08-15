Hostinger-friendly bundle and upload instructions

This repo already includes a Hostinger-ready static build process. Follow these steps to produce a ready-to-upload ZIP and upload it to Hostinger.

1) Build and package

```bash
cd frontend
npm install
# Build and create frontend/dist-hostinger.zip
npm run build:hostinger:zip
```

`dist-hostinger.zip` will be created in the `frontend` folder.

2) Upload to Hostinger

- Use Hostinger File Manager: upload `dist-hostinger.zip`, extract into `public_html`.
- Or use FTP (WinSCP/FileZilla) and upload the extracted files to `public_html`.

3) Confirm SPA routing

Ensure `frontend/dist-hostinger/.htaccess` is present in the site root so client-side routing works.

4) Backend

If you use features that need the backend (owner portal, poster uploads), deploy the backend to Render and set `VITE_BACKEND_URL` before building. See `backend/README.md` for Supabase/Render setup.

5) Optional automation

- Use `npm run deploy:hostinger` to deploy via FTP (needs `.env.deploy` filled).
- Or use the GitHub Actions workflow `deploy-hostinger.yml` to auto-deploy on push to `main` (set up Secrets).

That's it — the ZIP approach is simplest for Hostinger File Manager users.
