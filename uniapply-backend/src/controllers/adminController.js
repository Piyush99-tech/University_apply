import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../models/applicationModel.js";
import { getDocumentsForApplication } from "../models/documentModel.js";

export const listAllApplications = async (req, res, next) => {
  try {
    const apps = await getAllApplications();
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
};

export const getAdminApplicationDetail = async (req, res, next) => {
  try {
    const app = await getApplicationById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    const docs = await getDocumentsForApplication(app.id);

    // TODO: include AI extracted fields when available
    res.json({ application: app, documents: docs, ai: {} });
  } catch (err) {
    next(err);
  }
};

export const verifyApplication = async (req, res, next) => {
  try {
    const updated = await updateApplicationStatus(req.params.id, "VERIFIED");
    res.json({ application: updated });
  } catch (err) {
    next(err);
  }
};

export const raiseIssue = async (req, res, next) => {
  try {
    const updated = await updateApplicationStatus(req.params.id, "ISSUE_RAISED");
    // TODO: persist issue comments
    res.json({ application: updated });
  } catch (err) {
    next(err);
  }
};

export const rejectApplication = async (req, res, next) => {
  try {
    const updated = await updateApplicationStatus(req.params.id, "REJECTED");
    res.json({ application: updated });
  } catch (err) {
    next(err);
  }
};
