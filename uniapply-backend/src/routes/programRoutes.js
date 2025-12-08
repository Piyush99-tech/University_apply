import { Router } from "express";
import { createProgram, getAllPrograms } from "../controllers/programController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Public: List all programs
router.get("/", getAllPrograms);

// Admin only: Create a program
router.post("/", requireAuth, requireAdmin, createProgram);

export default router;
