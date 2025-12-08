# UniApply Backend (Node.js + Express + PostgreSQL)

This is the backend for the UniApply monolithic app. It exposes REST APIs for
authentication, student applications, document upload, and admin verification.

## Tech Stack

- Node.js + Express
- PostgreSQL (`pg`)
- JWT auth
- Multer for file uploads
- Helmet, CORS, morgan for security/logging

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env` and update values

```bash
cp .env.example .env
```

3. Create database & run schema

```bash
createdb uniapply
psql uniapply < schema.sql
```

4. Start dev server

```bash
npm run dev
```

Backend runs on `http://localhost:4000` by default.

## Key REST Endpoints

### Auth

- `POST /api/auth/register` – register student or admin (pass `role: "ADMIN"` manually for now)
- `POST /api/auth/login` – returns `{ user, token }`
- `GET /api/auth/me` – current user details (requires `Authorization: Bearer <token>`)

### Student Applications

- `POST /api/applications` – create draft application  
  body: `{ programId, universityId, formData }`
- `GET /api/applications` – list applications for logged-in student
- `GET /api/applications/:id` – application detail (student sees own, admin sees all)
- `POST /api/applications/:id/documents` – upload a document  
  form-data: `file`, `docType`

### Admin

(Requires role ADMIN)

- `GET /api/admin/applications` – list all applications
- `GET /api/admin/applications/:id` – detail with docs
- `POST /api/admin/applications/:id/verify` – mark as VERIFIED
- `POST /api/admin/applications/:id/issue` – mark as ISSUE_RAISED
- `POST /api/admin/applications/:id/reject` – mark as REJECTED

## Connecting Frontend & Backend

- Backend: `http://localhost:4000`
- Frontend (Next.js): `http://localhost:3000`

In your Next.js app, set:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Then call APIs from React components or server actions using:

```js
const base = process.env.NEXT_PUBLIC_API_BASE_URL;

const res = await fetch(`${base}/api/applications`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: "no-store",
});
```

This backend intentionally keeps AI integration as TODOs; you can plug your
LLaMA/extraction API inside the document upload controller or via a queue
in `src/jobs`.
