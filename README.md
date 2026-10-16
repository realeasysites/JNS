# Jalbert n' Sons LLC – Website

Node 20.x / Express / SQLite (better-sqlite3). Lead form -> database -> email alert, plus a password-protected lead dashboard at `/admin`.

## Run locally
cp .env.example .env   # fill in values
npm install && npm start

## Deploy on Render (Web Service)
- Root directory: repo root, Build: `npm install`, Start: `npm start`
- Env vars: ADMIN_PASSWORD, SESSION_SECRET, NOTIFY_EMAIL, SMTP_USER, SMTP_PASS
- Add a persistent disk (e.g. mount /var/data) and set DB_PATH=/var/data/leads.db, otherwise leads reset on each deploy.

## Adding photos (drop files into public/images/, same names, then redeploy)
- logo.png  – client logo (shows large in the hero, header badge, favicon and social-share image)
- about.jpg – crew / owner portrait (4:5)
- work-1.jpg … work-8.jpg – project gallery
- banner.jpg – client's service banner (shown under the hero)
(hero.jpg is optional: add a wide photo to use it as the hero background.)
Empty slots show a placeholder, so the site looks fine until photos arrive.

## Before launch
- Replace YOURDOMAIN.com in public/index.html (og:image) with the client's real domain (client buys/owns it).
- Confirm services list, service-area towns and ZIP (04364 used in schema) with the client.
- Change ADMIN_PASSWORD from the default.
- millwork.jpg – the JNS Custom Millwork promo graphic (client-supplied)
