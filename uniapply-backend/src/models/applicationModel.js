// src/models/applicationModel.js (or your equivalent path)

import { query } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Create new application
export const createApplication = async ({
  userId,
  programId,
  universityId,
  status,
  formData,
}) => {
  const id = uuidv4();
  const result = await query(
    `INSERT INTO applications
      (id, user_id, program_id, university_id, status, form_data)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id, userId, programId, universityId, status, formData]
  );
  return result.rows[0];
};

// Get single application by ID (no user restriction)
export const getApplicationById = async (id) => {
  const result = await query("SELECT * FROM applications WHERE id = $1", [id]);
  return result.rows[0];
};

// Get all applications for a specific user (student)
export const getApplicationsForUser = async (userId) => {
  const result = await query(
    `SELECT a.*,
            p.name AS program_name,
            u.short_name AS university_short_name
     FROM applications a
     JOIN programs p ON a.program_id = p.id
     JOIN universities u ON a.university_id = u.id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Get all applications (admin dashboard)
export const getAllApplications = async () => {
  const result = await query(
    `SELECT a.*,
            u.short_name AS university_short_name,
            p.name AS program_name,
            s.name AS student_name
     FROM applications a
     JOIN universities u ON a.university_id = u.id
     JOIN programs p ON a.program_id = p.id
     JOIN users s ON a.user_id = s.id
     ORDER BY a.created_at DESC`
  );
  return result.rows;
};

// ✅ For ADMIN use (verify / issue / reject etc.)
// Allows changing any application's status, and optionally ai_status
export const updateApplicationStatus = async (id, status, aiStatus = null) => {
  const result = await query(
    `UPDATE applications
       SET status = $2,
           ai_status = COALESCE($3, ai_status),
           updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status, aiStatus]
  );
  return result.rows[0];
};

// ✅ For STUDENT use (submit application)
// Ensures only the owner of the application can change its status
export const updateApplicationStatusForUser = async (
  applicationId,
  userId,
  status
) => {
  const result = await query(
    `UPDATE applications
       SET status = $3,
           updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [applicationId, userId, status]
  );
  return result.rows[0] || null;
};
