import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { createUser, findUserByEmail, findUserById } from "../models/userModel.js";
import { signToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hardcoded Admin Logic: Only 'admin@example.com' gets ADMIN role.
    // Everyone else is forced to STUDENT.
    const role = email === "admin@example.com" ? "ADMIN" : "STUDENT";

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      passwordHash: hash,
      role,
    });

    const token = signToken({ userId: user.id, role: user.role });
    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, role: user.role });
    const { password_hash, ...safeUser } = user;

    return res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
