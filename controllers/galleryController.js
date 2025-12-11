import Gallery from '../models/Gallery.js';
import fs from 'fs';
import path from 'path';

// Add Photo/Video
export const addMedia = async (req, res) => {
  try {
    const { type, name } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Validate type
    if (!['photo', 'video'].includes(type)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid type. Must be photo or video' 
      });
    }

    // Create gallery entry
const galleryItem = new Gallery({
  type,
  name: name || req.file.originalname,
  fileName: req.file.filename,
  filePath: req.file.path,
  fileSize: req.file.size,
  mimeType: req.file.mimetype,
  uploadedBy: req.user._id   // <-- THIS IS THE FIX
});

    await galleryItem.save();

    res.status(201).json({
      success: true,
      message: `${type === 'photo' ? 'Photo' : 'Video'} uploaded successfully`,
      data: galleryItem
    });

  } catch (error) {
    // Delete file if database operation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading media',
      error: error.message
    });
  }
};

// Get All Media (with filters)
export const getAllMedia = async (req, res) => {
  try {
    const { type, page = 1, limit = 20, search } = req.query;
    
    const query = { isActive: true };
    
    // Filter by type
    if (type && ['photo', 'video'].includes(type)) {
      query.type = type;
    }
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      Gallery.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('uploadedBy', 'name email'),
      Gallery.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
};

// Get Single Media by ID
export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findById(id)
      .populate('uploadedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
};

// Update Media Details
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (type && ['photo', 'video'].includes(type)) {
      updateData.type = type;
    }

    const item = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Media updated successfully',
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating media',
      error: error.message
    });
  }
};

// Delete Media
export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(item.filePath)) {
      fs.unlinkSync(item.filePath);
    }

    // Delete thumbnail if exists
    if (item.thumbnail && fs.existsSync(item.thumbnail)) {
      fs.unlinkSync(item.thumbnail);
    }

    // Delete from database
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting media',
      error: error.message
    });
  }
};

// Get Photos Only
export const getPhotos = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const [photos, total] = await Promise.all([
      Gallery.find({ type: 'photo', isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('uploadedBy', 'name email'),
      Gallery.countDocuments({ type: 'photo', isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: photos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching photos',
      error: error.message
    });
  }
};

// Get Videos Only
export const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const [videos, total] = await Promise.all([
      Gallery.find({ type: 'video', isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('uploadedBy', 'name email'),
      Gallery.countDocuments({ type: 'video', isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: videos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};