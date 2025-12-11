import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/database.js";
import authRoutes from "../routes/authRoutes.js";
import sliderRoutes from "../routes/sliderRoutes.js";
import galleryRoutes from "../routes/galleryRoutes.js";
import blogRoutes from "../routes/blogRoutes.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Prevent multiple DB connections in serverless
if (!global._mongoConnected) {
  connectDB();
  global._mongoConnected = true;
}

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Local dev only (Vercel won't support uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

// 🚀 REQUIRED EXPORT for Vercel serverless handler
export default (req, res) => {
  app(req, res);
};
