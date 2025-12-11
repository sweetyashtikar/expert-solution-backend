import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// Gallery uploads directory
const galleryDir = path.join(uploadsDir, 'gallery/');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
  console.log('✅ Created gallery directory:', galleryDir);
}

// Blog uploads directory
const blogDir = path.join(uploadsDir, 'blogs/');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
  console.log('📁 Created blog images folder:', blogDir);
}

// Storage for sliders
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for gallery
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, galleryDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.mimetype.startsWith('video/') ? 'video' : 'photo';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// ⭐ NEW: Storage for Blog thumbnails
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `blog-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for only images (Blog requirement)
const blogFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && mime.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image formats allowed for blogs (jpg, jpeg, png, webp)'));
  }
};

// File filter for images only (sliders)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

// File filter for gallery (images and videos)
const galleryFileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const videoTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (imageTypes.test(extname.slice(1)) && file.mimetype.startsWith('image/')) return cb(null, true);
  if (videoTypes.test(extname.slice(1)) && file.mimetype.startsWith('video/')) return cb(null, true);

  cb(new Error('Invalid file type. Only images and videos allowed.'));
};

// Existing exports
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const galleryUpload = multer({ storage: galleryStorage, fileFilter: galleryFileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

// ⭐ NEW Export for Blog Image Upload
export const blogUpload = multer({
  storage: blogStorage,
  fileFilter: blogFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
