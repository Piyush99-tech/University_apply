import { Router } from "express";
import { createUniversity, getAllUniversities } from "../controllers/universityController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Public: List all universities
router.get("/", getAllUniversities);

// Admin only: Create a university
router.post("/", requireAuth, requireAdmin, createUniversity);

export default router;
