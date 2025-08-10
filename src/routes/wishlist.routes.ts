import express from 'express';
import {
    addWishlistItem,
    removeWishlistItem,
    getUserWishlist,
    deleteUserWishlist
} from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';
const router = express.Router();

// Add land to wishlist
router.post('/', protect, addWishlistItem);

// Remove land from wishlist by landId
router.delete('/:landId', protect, removeWishlistItem);
router.delete('/', protect, deleteUserWishlist);

// Get wishlist for logged-in user
router.get('/', protect, getUserWishlist);

export default router;
