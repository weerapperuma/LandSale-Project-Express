import express from 'express';
import multer from 'multer';
import {
    createLand,
    getAllLands,
    getLandById,
    updateLand,
    deleteLand,
    updateLandImages,
    removeImagesFromLand
} from '../controllers/land.controller';

const router = express.Router();

// Use memory storage to avoid timeout issues with CloudinaryStorage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Max 10 files
    }
});

// Routes
router.post('/', upload.array('images', 10), createLand);              // Create with images
router.get('/', getAllLands);                                          // Get all
router.get('/:id', getLandById);                                       // Get by ID
router.put('/:id', upload.array('images', 10), updateLand);           // Update with optional new images
router.delete('/:id', deleteLand);                                     // Delete (removes images too)
router.put('/:id/images', upload.array('images', 10), updateLandImages); // Update only images
router.delete('/:id/images', removeImagesFromLand);                    // Remove specific images

export default router;