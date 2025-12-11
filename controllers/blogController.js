import fs from "fs";
import { createBlogService, getAllBlogsService, deleteBlogService } from "../services/blogService.js";

export const addBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const blogData = {
      title,
      description,
      uploadedBy: req.user._id,
      image: {
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    };

    const newBlog = await createBlogService(blogData);

    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      data: newBlog,
    });

  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: "Error adding blog", error: error.message });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs" });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blog = await deleteBlogService(req.params.id);

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (blog.image?.filePath && fs.existsSync(blog.image.filePath)) {
      fs.unlinkSync(blog.image.filePath);
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting blog" });
  }
};
