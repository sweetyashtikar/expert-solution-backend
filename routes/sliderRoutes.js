import express from 'express';
import {
  getAllSliders,
  getSlider,
  createSlider,
  updateSlider,
  deleteSlider,
  toggleSliderStatus
} from '../controllers/sliderController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllSliders);
router.get('/:id', getSlider);

// Protected routes
router.post('/', protect, upload.single('image'), createSlider);
router.put('/:id', protect, upload.single('image'), updateSlider);
router.delete('/:id', protect, deleteSlider);
router.patch('/:id/toggle', protect, toggleSliderStatus);

export default router;