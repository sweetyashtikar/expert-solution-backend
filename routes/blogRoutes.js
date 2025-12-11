import express from "express";
import { protect } from "../middleware/auth.js";
import { blogUpload } from "../middleware/upload.js";
import { addBlog, getBlogs, deleteBlog } from "../controllers/blogController.js";

const router = express.Router();

router.post("/add", protect, blogUpload.single("image"), addBlog);
router.get("/", getBlogs);
router.delete("/:id", protect, deleteBlog);

export default router;
