// src/config/initDb.js
import { query } from "./db.js";

export async function initDb() {
  console.log("Running DB init / migrations...");

  // Enable uuid extension
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // Users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'STUDENT',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Universities
  await query(`
    CREATE TABLE IF NOT EXISTS universities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Programs
  await query(`
    CREATE TABLE IF NOT EXISTS programs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Applications
  await query(`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
      university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      ai_status TEXT,
      form_data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Application documents
  await query(`
    CREATE TABLE IF NOT EXISTS application_documents (
      id SERIAL PRIMARY KEY,
      application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      doc_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UPLOADED',
      file_path TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("DB init / migrations completed ✅");
}
