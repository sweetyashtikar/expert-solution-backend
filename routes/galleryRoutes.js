import express from 'express';
import { 
  addMedia, 
  getAllMedia, 
  getMediaById, 
  updateMedia, 
  deleteMedia,
  getPhotos,
  getVideos 
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';  // ✅ protect import कर
import { galleryUpload } from '../middleware/upload.js';  // ✅ Uncomment कर

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);  // ✅ protect वापर

// Add media (photo or video)
router.post('/add', galleryUpload.single('file'), addMedia);

// Get all media (with optional filters)
router.get('/', getAllMedia);

// Get only photos
router.get('/photos', getPhotos);

// Get only videos
router.get('/videos', getVideos);

// Get single media by ID
router.get('/:id', getMediaById);

// Update media details
router.put('/:id', updateMedia);

// Delete media
router.delete('/:id', deleteMedia);

export default router;