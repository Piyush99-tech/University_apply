import { verifyToken } from "../utils/jwt.js";
import { query } from "../config/db.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyToken(token);
    const result = await query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const requireAdmin = requireRole("ADMIN");
