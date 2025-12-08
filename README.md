


Note-> Since ADMIN is only single entity there is one to many relationship with users so I have made pre-defined admin with its credential as
email->admin@example.com
password->admin123
🏫 UniApply — Unified University Application Platform

UniApply is a full-stack monolithic application that allows students to apply to universities online, upload required documents, and get AI-powered verification. Admin users review submissions and validate student applications.

🚀 Tech Stack
Layer	Technology
Frontend	Next.js, React, Tailwind CSS
Backend	Node.js, Express.js
Database	PostgreSQL
Authentication	JWT Auth (Access Token)
AI Document Verification	OpenAI API + PDF Parsing
File Handling	Multer (Disk Storage)
API Format	REST API
Deployment (Planned)	Docker, GitHub, Cloud Provider
✨ Core Features
🎓 Student Side

✔ Register/Login with JWT
✔ View eligible university programs
✔ Create and manage applications
✔ Upload required documents (PDF, PNG, JPG)
✔ Document AI verification (Aadhar, Marksheet, etc.)
✔ Track application & document statuses in real-time

Document Status Lifecycle:

PROCESSING

VERIFIED

ISSUE_RAISED

REJECTED

Application Status Lifecycle:

DRAFT

SUBMITTED

VERIFIED

ISSUE_RAISED

REJECTED

🛂 Admin Side

✔ Secure admin access
✔ View all applications with AI result flags
✔ Download/check uploaded documents
✔ Manual review + decision actions:

Approve Application → VERIFIED

Raise Issues → ISSUE_RAISED

Reject Application → REJECTED

🤖 AI Verification Workflow

AI extracts text from uploaded PDF using pdf-parse.
Then we send context to OpenAI to detect mismatches with student data:

Example prompt fields:

Name

DOB

Roll Number

School/Board Name

Percentage / Score

Response is always structured JSON:

{
  "has_issue": false,
  "issues": [],
  "summary": "Document matches form data"
}


Application AI flags update automatically:

OK → All docs valid 💚

FLAGGED → Issues detected 🟡

🗄 Database Schema (Simplified)
users
applications
application_documents
universities
programs


PostgreSQL ensures relational consistency across applicant records.

🔧 Installation & Setup

Clone the repos:

git clone https://github.com/Piyush99-tech/University_apply


Install backend dependencies:

cd uniapply-backend
npm install


Create .env based on .env.example:

PORT=4000
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=uniapply
OPENAI_API_KEY=sk-...
JWT_SECRET=my_uniapply_secret


Start backend:

npm run dev


Install frontend:

cd uniapply-frontend
npm install
npm run dev


Visit → http://localhost:3000 ✔

Backend API → http://localhost:4000/api

🧪 Test Users

Create via Postman:

Student

{
  "name": "Test Student",
  "email": "student@example.com",
  "password": "password123",
  "role": "STUDENT"
}


Admin

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN"
}

📌 Pending Enhancements
Feature	Status
Full Admin Dashboard UI	⏳ In Progress
Multi-university program selection	🚧
Email notifications	🚧
Containerization (Docker)	Not started
Production deployment	Not started
🧑‍💻 Contributors
Name	Role
Piyush Kala	Full Stack Development
ChatGPT AI Assist	Co-pilot Design & Dev Support
🛡 License

MIT License © 2025 UniApply Project
