import { Router } from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password min length 6"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", requireAuth, me);

export default router;
