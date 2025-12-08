import { Router } from "express";
import { body } from "express-validator";
import {
  createStudentApplication,
  getMyApplications,
  getApplicationDetail,
  uploadDocument,
  submitApplication,   // <-- added
} from "../controllers/applicationController.js";
import { requireAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Student creates new application (DRAFT)
router.post(
  "/",
  requireAuth,
  [
    body("programId").notEmpty().withMessage("programId is required"),
    body("universityId").notEmpty().withMessage("universityId is required"),
    body("formData").isObject().withMessage("formData must be an object"),
  ],
  createStudentApplication
);

// Student applications list
router.get("/", requireAuth, getMyApplications);

// Application detail (student or admin)
router.get("/:id", requireAuth, getApplicationDetail);

// Document upload
router.post(
  "/:id/documents",
  requireAuth,
  upload.single("file"),
  uploadDocument
);

// 💥 NEW: Submit application for review (DRAFT → SUBMITTED)
router.post("/:id/submit", requireAuth, submitApplication);

export default router;
