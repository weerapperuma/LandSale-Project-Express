// src/routes/upload.route.ts
import express from 'express'
import multer from 'multer'
import { storage } from '../utils/cloudinary'
import { uploadImage } from '../controllers/upload.controller'

const router = express.Router()

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post('/uploadimage', upload.single('image'), uploadImage)

export default router
