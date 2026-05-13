# Airbnb Fullstack (Local Integration)

This workspace contains a frontend (`airbnb-app`) and a backend (`airbnb-app-backend`). These instructions show how to run both locally and use seeded test accounts for quick verification.

Prerequisites
- Node.js (v18+ recommended)
- pnpm (optional) or npm

Backend (local)
1. Open a terminal and go to `airbnb-app-backend`.
2. Install dependencies:

```powershell
cd airbnb-app-backend
pnpm install   # or `npm install`
```

3. Create a `.env` (or update) with your database and other env vars. An example file is provided as `.env.example`.
4. (Optional) Run Prisma seed to populate sample data:

```powershell
pnpm run db:seed
```

5. Start the backend dev server:

```powershell
pnpm run dev
```

The backend will be available at `http://localhost:3000` and Swagger at `http://localhost:3000/api-docs`.

Frontend (local)
1. Open a second terminal and go to `airbnb-app`.
2. Copy `.env.example` to `.env` and ensure `VITE_API_URL` points to the backend (default used by this repo):

```text
VITE_API_URL=http://localhost:3000/api/v1
```

3. Install and start the frontend:

```powershell
cd airbnb-app
pnpm install   # or `npm install`
pnpm run dev
```

The frontend dev server runs on Vite at `http://localhost:5173` (or the next available port).

Seeded test accounts
You can use the seeded users to test authentication and flows. All seeded users use the password: `password123`.

- Host account:
  - Email: `john@mail.com`
  - Password: `password123`

- Guest account:
  - Email: `bob@mail.com`
  - Password: `password123`

There are more seeded users (see `airbnb-app-backend/prisma/seed.ts`) including `alice@mail.com`, `jane@mail.com`, `mike@mail.com`, etc., all using `password123`.

Quick verification
- Backend health: `GET http://localhost:3000/health`
- API root: `GET http://localhost:3000/api/v1`
- Register/login from frontend or use the E2E script at `airbnb-app-backend/scripts/e2e_auth.ps1`.

Commit & notes
- I updated the frontend to read `VITE_API_URL` and added a `.env.example`.
- I replaced native `bcrypt` usage in development code with `bcryptjs` to avoid native build issues; production builds can revert to native `bcrypt` if desired.

If you want, I can push these commits to a remote, run additional E2E scenarios, or add CI scripts.
