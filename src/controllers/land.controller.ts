import { LandService } from '../services/land.service';
import { Request, Response } from 'express';

// Create land ad with images and detailed logging
export const createLand = async (req: Request, res: Response) => {
  console.log('=== CREATE LAND REQUEST ===');
  console.log('User:', (req as any).user);
  console.log('Body:', req.body);
  console.log('Files:', req.files ? (req.files as Express.Multer.File[]).map(f => ({
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size
  })) : 'No files');

  try {
    // Validate required fields
    const { title, description, district, city, price, size ,userId} = req.body;

    if (!title || !description || !district || !city || !price || !size || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['title', 'description', 'district', 'city', 'price', 'size', 'userId']
      });
    }

    console.log('Starting land creation...');
    const startTime = Date.now();

    const land = await LandService.createLand(req.body, req.files as Express.Multer.File[]);

    const endTime = Date.now();
    console.log(`Land created successfully in ${endTime - startTime}ms`);

    res.status(201).json({
      success: true,
      data: land,
      message: 'Land ad created successfully',
      processingTime: `${endTime - startTime}ms`
    });
  } catch (error) {
    console.error('=== CREATE LAND ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

    res.status(500).json({
      success: false,
      error: 'Failed to create land',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Get all land ads
export const getAllLands = async (req: Request, res: Response) => {
  try {
    const lands = await LandService.getAllLands();

    res.json({
      success: true,
      data: lands,
      count: lands.length
    });
  } catch (error) {
    console.error('Get all lands error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch land ads',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all lands posted by a specific user
export const getLandsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
      });
    }

    console.log(`Fetching lands for userId: ${userId}`);

    const lands = await LandService.getLandsByUserId(userId);

    res.json({
      success: true,
      data: lands,
      count: lands.length,
    });
  } catch (error) {
    console.error('Error fetching lands by userId:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch land ads by user',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get single land ad by ID
export const getLandById = async (req: Request, res: Response) => {
  try {
    console.log(`Fetching land with ID: ${req.params.id}`);
    const land = await LandService.getLandById(req.params.id);

    if (!land) {
      console.log(`Land not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Land ad not found'
      });
    }

    console.log(`Found land: ${land.title}`);
    res.json({
      success: true,
      data: land
    });
  } catch (error) {
    console.error('Get land by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch land ad',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update land ad with optional new images
export const updateLand = async (req: Request, res: Response) => {
  console.log('=== UPDATE LAND REQUEST ===');
  console.log('User:', (req as any).user);
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('Files:', req.files ? (req.files as Express.Multer.File[]).length : 0);

  try {
    const startTime = Date.now();
    const userId = (req as any).user.id;

    // Check if user owns this land ad
    const existingLand = await LandService.getLandById(req.params.id);
    if (!existingLand) {
      return res.status(404).json({
        success: false,
        error: 'Land ad not found'
      });
    }

    if (existingLand.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own land ads'
      });
    }

    const land = await LandService.updateLand(
        req.params.id,
        req.body,
        req.files as Express.Multer.File[]
    );

    if (!land) {
      return res.status(404).json({
        success: false,
        error: 'Land ad not found'
      });
    }

    const endTime = Date.now();
    console.log(`Land updated successfully in ${endTime - startTime}ms`);

    res.json({
      success: true,
      data: land,
      message: 'Land ad updated successfully',
      processingTime: `${endTime - startTime}ms`
    });
  } catch (error) {
    console.error('=== UPDATE LAND ERROR ===');
    console.error('Error details:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update land ad',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// DELETE /api/v1/lands/:id
export const deleteLand = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const landId = req.params.id;

    const existingLand = await LandService.getLandById(landId);
    if (!existingLand) {
      return res.status(404).json({
        success: false,
        error: 'Land ad not found',
      });
    }

    // Delete land and its images via service
    const deletedLand = await LandService.deleteLand(landId);
    if (!deletedLand) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete land ad',
      });
    }

    const endTime = Date.now();
    console.log(`Land deleted successfully in ${endTime - startTime}ms`);

    return res.status(200).json({
      success: true,
      message: 'Land ad and associated images deleted successfully',
      processingTime: `${endTime - startTime}ms`,
    });
  } catch (error) {
    console.error('=== DELETE LAND ERROR ===');
    console.error('Error details:', error);

    return res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the land ad',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update only images for a land ad
export const updateLandImages = async (req: Request, res: Response) => {
  console.log('=== UPDATE LAND IMAGES REQUEST ===');
  console.log('ID:', req.params.id);
  console.log('Files:', req.files ? (req.files as Express.Multer.File[]).length : 0);

  try {
    const startTime = Date.now();

    const land = await LandService.updateLandImages(
      req.params.id,
      req.files as Express.Multer.File[]
    );

    if (!land) {
      return res.status(404).json({
        success: false,
        error: 'Land ad not found'
      });
    }

    const endTime = Date.now();
    console.log(`Land images updated successfully in ${endTime - startTime}ms`);

    res.json({
      success: true,
      data: land,
      message: 'Land images updated successfully',
      processingTime: `${endTime - startTime}ms`
    });
  } catch (error) {
    console.error('=== UPDATE LAND IMAGES ERROR ===');
    console.error('Error details:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update land images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Remove specific images from a land ad
export const removeImagesFromLand = async (req: Request, res: Response) => {
  console.log('=== REMOVE LAND IMAGES REQUEST ===');
  console.log('ID:', req.params.id);
  console.log('Body:', req.body);

  try {
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        success: false,
        error: 'imageUrls array is required'
      });
    }

    const startTime = Date.now();

    const land = await LandService.removeImagesFromLand(
      req.params.id,
      imageUrls
    );

    if (!land) {
      return res.status(404).json({
        success: false,
        error: 'Land ad not found'
      });
    }

    const endTime = Date.now();
    console.log(`Land images removed successfully in ${endTime - startTime}ms`);

    res.json({
      success: true,
      data: land,
      message: 'Land images removed successfully',
      processingTime: `${endTime - startTime}ms`
    });
  } catch (error) {
    console.error('=== REMOVE LAND IMAGES ERROR ===');
    console.error('Error details:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to remove land images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};