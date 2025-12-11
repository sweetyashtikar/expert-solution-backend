import Blog from "../models/Blog.js";

export const createBlogService = async (data) => {
  return await Blog.create(data);
};

export const getAllBlogsService = async () => {
  return await Blog.find().populate("uploadedBy", "name email");
};

export const deleteBlogService = async (id) => {
  return await Blog.findByIdAndDelete(id);
};
