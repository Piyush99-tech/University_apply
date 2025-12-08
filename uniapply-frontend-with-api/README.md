# UniApply Frontend (Next.js + React + Tailwind)

This is the frontend for UniApply. It connects to the backend via REST APIs.

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

3. Run dev server

```bash
npm run dev
```

Frontend will be on `http://localhost:3000`.

## Key Routes

- `/` – Landing
- `/login` – Login page (uses `/api/auth/login`)
- `/student` – Student dashboard
- `/student/universities` – Mock program selection
- `/student/applications` – Loads applications from backend
- `/student/applications/[id]` – Shows application detail and document upload UI
- `/admin` – Admin dashboard
- `/admin/applications` – Loads all applications from backend
- `/admin/applications/[id]` – Review app, see docs, and perform verify/issue/reject
