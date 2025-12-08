import { query } from "../config/db.js";

export const getAllPrograms = async (req, res, next) => {
    try {
        const result = await query(`
      SELECT p.*, u.name as university_name, u.short_name as university_short_name 
      FROM programs p
      JOIN universities u ON p.university_id = u.id
      ORDER BY p.name ASC
    `);
        res.json({ programs: result.rows });
    } catch (err) {
        next(err);
    }
};

export const createProgram = async (req, res, next) => {
    try {
        const { university_id, code, name, degree_level, eligibility_rules } = req.body;

        // Basic validation
        if (!university_id || !code || !name) {
            return res.status(400).json({ message: "University ID, Code and Name are required" });
        }

        const result = await query(
            `INSERT INTO programs 
       (university_id, code, name, degree_level, eligibility_rules) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [university_id, code, name, degree_level, eligibility_rules]
        );

        res.status(201).json({ program: result.rows[0] });
    } catch (err) {
        next(err);
    }
};
