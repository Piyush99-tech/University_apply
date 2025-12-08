import { Router } from "express";
import {
  listAllApplications,
  getAdminApplicationDetail,
  verifyApplication,
  raiseIssue,
  rejectApplication,
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/applications", listAllApplications);
router.get("/applications/:id", getAdminApplicationDetail);
router.post("/applications/:id/verify", verifyApplication);
router.post("/applications/:id/issue", raiseIssue);
router.post("/applications/:id/reject", rejectApplication);

export default router;
