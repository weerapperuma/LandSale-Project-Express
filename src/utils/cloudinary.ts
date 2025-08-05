// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'land_ads',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
      // You can set public_id dynamically if you want:
      // public_id: 'my_custom_id'
    }
  },
})

export { cloudinary, storage }
