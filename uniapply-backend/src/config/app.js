import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "../routes/authRoutes.js";
import applicationRoutes from "../routes/applicationRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploads (for debugging)
app.use("/uploads", express.static(path.join(__dirname, "..", "..", process.env.UPLOAD_DIR || "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

import universityRoutes from "../routes/universityRoutes.js";
import programRoutes from "../routes/programRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/programs", programRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;
