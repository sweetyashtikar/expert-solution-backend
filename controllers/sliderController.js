import Slider from '../models/Slider.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all sliders
// @route   GET /api/sliders
// @access  Public
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: sliders.length,
      data: sliders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single slider
// @route   GET /api/sliders/:id
// @access  Public
export const getSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    res.json({
      success: true,
      data: slider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create slider
// @route   POST /api/sliders
// @access  Private
export const createSlider = async (req, res) => {
  try {
    const { name, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const slider = await Slider.create({
      name,
      image: `/uploads/${req.file.filename}`,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Slider created successfully',
      data: slider
    });
  } catch (error) {
    // Delete uploaded file if slider creation fails
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../../uploads/', req.file.filename));
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update slider
// @route   PUT /api/sliders/:id
// @access  Private
// @desc    Update slider
// @route   PUT /api/sliders/:id
// @access  Private
export const updateSlider = async (req, res) => {
  try {
    let slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    const updateData = { 
      ...req.body,
      updatedAt: Date.now()  // Manually update timestamp
    };

    // If new image is uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../../', slider.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    slider = await Slider.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Slider updated successfully',
      data: slider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Delete slider
// @route   DELETE /api/sliders/:id
// @access  Private
export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../../', slider.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Slider.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle slider active status
// @route   PATCH /api/sliders/:id/toggle
// @access  Private
export const toggleSliderStatus = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    slider.isActive = !slider.isActive;
    await slider.save();

    res.json({
      success: true,
      message: `Slider ${slider.isActive ? 'activated' : 'deactivated'} successfully`,
      data: slider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};