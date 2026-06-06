First Interior database export

This project does not use a MySQL/SQLite database file.
Current dynamic reels data is stored on Vercel Blob through /api/reels.

Files:
- reels.json: exported reels records from the live site.

Hostinger note:
- If you use normal shared hosting, this JSON file is only a backup/import file.
- Reel upload/delete needs a Node/server API or a rewritten PHP/MySQL backend.
- Do not upload .env.local publicly because it can contain secret tokens.
