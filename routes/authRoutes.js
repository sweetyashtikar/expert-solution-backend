import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getCurrentAdmin);

export default router;