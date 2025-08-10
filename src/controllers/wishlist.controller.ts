import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';

// Add a land to user's wishlist
export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { landId } = req.body;

    if (!userId || !landId) {
      return res.status(400).json({ success: false, message: 'Missing userId or landId' });
    }

    const wishlist = await WishlistService.addToWishlist(userId, landId);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove a land from user's wishlist
export const removeWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { landId } = req.params;

    if (!userId || !landId) {
      return res.status(400).json({ success: false, message: 'Missing userId or landId' });
    }

    const wishlist = await WishlistService.removeFromWishlist(userId, landId);

    if (!wishlist) {
      // Means wishlist doc was deleted because no lands left
      return res.json({ success: true, message: 'Wishlist empty and removed' });
    }

    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all wishlist lands for user
export const getUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const wishlist = await WishlistService.getWishlistByUser(userId);
    if (!wishlist) {
      return res.json({ success: true, count: 0, data: [] });
    }

    res.json({ success: true, count: wishlist.landIds.length, data: wishlist.landIds });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const deleteUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const result = await WishlistService.removeAllByUser(userId);

    if (result.deletedCount && result.deletedCount > 0) {
      return res.json({ success: true, message: 'Wishlist deleted successfully' });
    } else {
      return res.json({ success: true, message: 'No wishlist found to delete' });
    }
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};