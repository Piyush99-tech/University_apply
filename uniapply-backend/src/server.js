// src/server.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./config/app.js";
import { initDb } from "./config/initDb.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function startServer() {
  try {
    // 1) Ensure DB schema exists (both local + Render)
    await initDb();

    // 2) Start HTTP server
    app.listen(PORT, () => {
      console.log(`UniApply backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize DB:", err);
    process.exit(1); // crash container so Render shows the error
  }
}

startServer();
