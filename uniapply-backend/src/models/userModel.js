import { query } from "../config/db.js";

export const createUser = async ({ name, email, passwordHash, role }) => {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
