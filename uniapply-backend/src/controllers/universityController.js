import { query } from "../config/db.js";

export const getAllUniversities = async (req, res, next) => {
    try {
        const result = await query("SELECT * FROM universities ORDER BY name ASC");
        res.json({ universities: result.rows });
    } catch (err) {
        next(err);
    }
};

export const createUniversity = async (req, res, next) => {
    try {
        const { name, short_name, location } = req.body;

        // Basic validation
        if (!name || !short_name) {
            return res.status(400).json({ message: "Name and Short Name are required" });
        }

        const result = await query(
            "INSERT INTO universities (name, short_name, location) VALUES ($1, $2, $3) RETURNING *",
            [name, short_name, location]
        );

        res.status(201).json({ university: result.rows[0] });
    } catch (err) {
        next(err);
    }
};
