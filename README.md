# MaaCare

A child routine, discipline, and habit-building app designed for parents to manage their child's daily activities in a friendly and motivating way.

## Features

- Parent accounts with secure JWT authentication
- Multiple child profiles with avatars
- Morning and night routine management
- Real-time progress tracking with weekly history
- Rewards and achievement badges
- Daily affirmations
- Cloud-synced data via REST API

## Tech Stack

**Frontend:** React Native (Expo), TypeScript, React Navigation  
**Backend:** Node.js, Express, SQLite, JWT, bcrypt

## Quick Start (Local)

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install and start the backend

```bash
npm run server:install
cd server
copy .env.example .env
cd ..
npm run server
```

The API runs at `http://localhost:3001`.

### 3. Configure the frontend (optional)

```bash
copy .env.example .env
```

Set `EXPO_PUBLIC_API_URL=http://localhost:3001` (this is the default).

### 4. Start the app

```bash
npm run web
```

Or run both together:

```bash
npm run dev
```

## Deploy to Production (Free)

Use **Render** for the API (needs a persistent server + SQLite) and **Vercel** for the web app.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "MaaCare app with API and web frontend"
git remote add origin https://github.com/YOUR_USERNAME/maacare.git
git push -u origin main
```

### Step 2 — Backend on Render (free tier)

1. Sign up at [render.com](https://render.com) and connect GitHub.
2. Create a **New Blueprint** and point it at your repo (uses `render.yaml`), **or** create a **Web Service** manually:
   - **Root directory:** leave blank (repo root)
   - **Build command:** `cd server && npm install`
   - **Start command:** `cd server && npm start`
3. Set environment variables:
   - `JWT_SECRET` — long random string (Render can auto-generate)
   - `CORS_ORIGIN` — your Vercel URL (set after Step 3), e.g. `https://maacare.vercel.app`
   - `DATA_DIR` — `/opt/render/project/src/server/data`
   - (for password reset emails) `SENDGRID_API_KEY` — your SendGrid API key
   - `SENDER_EMAIL` — the verified sender address (e.g. no-reply@yourdomain.com)
   - `FRONTEND_URL` — your Vercel URL, e.g. `https://maacare.vercel.app` (used to build reset links)
4. Deploy and copy your API URL, e.g. `https://maacare-api.onrender.com`.

Note: For password reset to send real emails, set `SENDGRID_API_KEY` and `SENDER_EMAIL` on Render. The server will send a secure, one-hour reset link to `FRONTEND_URL/reset-password?token=...`. If not set, the API will return the token in the response for dev/test only.

> **Note:** Render free tier sleeps after inactivity. The first request may take ~30 seconds to wake up.

### Step 3 — Frontend on Vercel (free tier)

1. Sign up at [vercel.com](https://vercel.com) and import your GitHub repo.
2. Vercel reads `vercel.json` automatically:
   - Build: `npx expo export --platform web`
   - Output: `dist`
3. Add environment variable:
   - `EXPO_PUBLIC_API_URL` = your Render API URL (no trailing slash)
4. Deploy — you get a URL like `https://maacare.vercel.app`.
5. Go back to Render and set `CORS_ORIGIN` to your Vercel URL, then redeploy the API.

### Step 4 — Verify

1. Open your Vercel URL.
2. Create an account and add a child profile.
3. Complete tasks and check Progress / Rewards tabs.
4. In Settings, confirm **Server: Connected**.

### Local development (Windows note)

The API uses `better-sqlite3`, which needs build tools on Windows. For local dev you can:

- Use **WSL** or **Docker**, or install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with “Desktop development with C++”.
- Or develop the frontend only against your deployed Render API by setting `EXPO_PUBLIC_API_URL` in `.env`.

### Mobile (optional)

Use Expo Go for development, or build with EAS:

```bash
npx eas build --platform android
```

Set `EXPO_PUBLIC_API_URL` in your EAS environment to point to the deployed API.

## Project Structure

```
src/
 ├── screens/       # App screens
 ├── components/    # Reusable UI components
 ├── navigation/    # React Navigation setup
 ├── context/       # Global state (synced with API)
 ├── services/      # API client
 ├── data/          # Static data (avatars, affirmations)
 └── theme/         # Design system
server/
 ├── src/           # Express API
 └── data/          # SQLite database (created at runtime)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/children` | List children |
| POST | `/api/children` | Add child |
| PUT | `/api/children/:id` | Update child |
| DELETE | `/api/children/:id` | Delete child |
| POST | `/api/tasks/:childId` | Add task |
| PUT | `/api/tasks/:taskId` | Update task |
| PATCH | `/api/tasks/:taskId/toggle` | Toggle task |
| DELETE | `/api/tasks/:taskId` | Delete task |
| GET | `/api/progress/:childId/weekly` | Weekly progress |
| GET | `/api/progress/:childId/streaks` | Activity & perfect streaks |

## License

Private — for personal use.
