// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/database.js';
// import authRoutes from './routes/authRoutes.js';
// import sliderRoutes from './routes/sliderRoutes.js';
// import galleryRoutes from './routes/galleryRoutes.js';
// import blogRoutes from "./routes/blogRoutes.js";

// // ES Module __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:3000', // Your Next.js frontend URL
//   credentials: true
// }));

// // Static folder for uploads
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/sliders', sliderRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use("/api/blogs", blogRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'Server is running' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Server Error'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

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

// Load env variables
dotenv.config();

// Connect Database
connectDB();

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

// Static folder (Vercel does NOT support local uploads, but keep for local dev)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ❌ REMOVE app.listen()
// Serverless functions DON’T use app.listen()

export default app;
