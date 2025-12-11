import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // For videos - duration in seconds
    default: null
  },
  dimensions: {
    width: Number,
    height: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
gallerySchema.index({ type: 1, isActive: 1 });
gallerySchema.index({ createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);