import { query } from "../config/db.js";

export const addDocument = async ({
  applicationId,
  docType,
  filePath,
  originalName,
  mimeType,
  status = "UPLOADED",
}) => {
  const result = await query(
    `INSERT INTO application_documents
      (application_id, doc_type, file_path, original_name, mime_type, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [applicationId, docType, filePath, originalName, mimeType, status]
  );
  return result.rows[0];
};

export const getDocumentsForApplication = async (applicationId) => {
  const result = await query(
    "SELECT * FROM application_documents WHERE application_id = $1 ORDER BY created_at ASC",
    [applicationId]
  );
  return result.rows;
};

export const updateDocumentStatus = async (id, status, aiResult) => {
  const result = await query(
    `UPDATE application_documents 
     SET status = $2, ai_result = $3 
     WHERE id = $1 
     RETURNING *`,
    [id, status, aiResult]
  );
  return result.rows[0];
};
