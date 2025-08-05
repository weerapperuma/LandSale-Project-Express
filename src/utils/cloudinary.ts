// src/utils/cloudinary.ts - Enhanced with better timeout handling
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Enhanced cloudinary config with timeout settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  // Add timeout configurations
  upload_timeout: 60000, // 60 seconds
  timeout: 60000,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Add file validation
    console.log(`Processing file: ${file.originalname}, Size: ${file.size} bytes`);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File ${file.originalname} exceeds 5MB limit`);
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File ${file.originalname} has invalid format. Only JPG, JPEG, PNG allowed`);
    }

    return {
      folder: 'land_ads',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
      resource_type: 'image',
      // Generate unique filename
      public_id: `land_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    }
  },
})

export { cloudinary, storage }