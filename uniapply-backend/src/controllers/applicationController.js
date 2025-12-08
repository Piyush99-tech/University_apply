// src/controllers/applicationController.js

import { validationResult } from "express-validator";
import {
  createApplication,
  getApplicationById,
  getApplicationsForUser,
  updateApplicationStatusForUser,
} from "../models/applicationModel.js";
import {
  addDocument,
  getDocumentsForApplication,
  updateDocumentStatus,
} from "../models/documentModel.js";
import { verifyDocument } from "../services/aiService.js";

export const createStudentApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { programId, universityId, formData } = req.body;
    const app = await createApplication({
      userId: req.user.id,
      programId,
      universityId,
      status: "DRAFT",
      formData,
    });

    res.status(201).json({ application: app });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const apps = await getApplicationsForUser(req.user.id);
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
};

export const getApplicationDetail = async (req, res, next) => {
  try {
    const app = await getApplicationById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // simple ownership check for student side
    if (req.user.role === "STUDENT" && app.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const docs = await getDocumentsForApplication(app.id);
    res.json({ application: app, documents: docs });
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { docType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = await addDocument({
      applicationId: id,
      docType,
      filePath: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    // Verify with AI
    let aiStatus = "UPLOADED";
    let aiResult = {};

    try {
      const result = await verifyDocument(req.file.path, req.file.mimetype, docType);
      aiResult = result;
      if (result.valid && result.confidence > 0.7) {
        aiStatus = "VERIFIED";
      } else {
        aiStatus = "ISSUE_RAISED";
      }
    } catch (e) {
      console.error("AI Service Error", e);
      aiResult = { error: e.message };
      aiStatus = "ISSUE_RAISED";
    }

    const updatedDoc = await updateDocumentStatus(doc.id, aiStatus, aiResult);

    res.status(201).json({ document: updatedDoc });
  } catch (err) {
    next(err);
  }
};

// NEW: student submits application (DRAFT -> SUBMITTED)
export const submitApplication = async (req, res, next) => {
  try {

    console.log("HY");
    const { id } = req.params; // application id
    const userId = req.user.id;

    // Ensure application exists and belongs to this user
    const app = await getApplicationById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (app.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Optional: prevent re-submission if already beyond DRAFT
    if (
      app.status === "SUBMITTED" ||
      app.status === "VERIFIED" ||
      app.status === "ISSUE_RAISED" ||
      app.status === "REJECTED"
    ) {
      return res.status(400).json({
        message: `Application already in status ${app.status}`,
      });
    }

    const updated = await updateApplicationStatusForUser(
      id,
      userId,
      "SUBMITTED"
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({ application: updated });
  } catch (err) {
    next(err);
  }
};
