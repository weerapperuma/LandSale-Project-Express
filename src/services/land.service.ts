import LandAd from '../models/LandAd';
import {UploadService} from "./upload.service";

export class LandService {
    // Create land with images (upload images to cloudinary first)
    static async createLand(data: any, imageFiles?: Express.Multer.File[]) {
        let imageUrls: string[] = []

        // Upload images to cloudinary if provided
        if (imageFiles && imageFiles.length > 0) {
            imageUrls = await UploadService.uploadImages(imageFiles)
        }

        const landData = {
            ...data,
            images: imageUrls,
        }

        const land = new LandAd(landData)
        return await land.save()
    }

    // Get all land ads
    static async getAllLands() {
        return await LandAd.find();
    }

    // Get all lands by specific user
    static async getLandsByUserId(userId: string) {
        return await LandAd.find({ userId });
    }


    // Get a single land ad by ID
    static async getLandById(id: string) {
        return await LandAd.findById(id);
    }

    // Update a land ad by ID with optional new images
    static async updateLand(id: string, data: any, imageFiles?: Express.Multer.File[]) {
        try {
            // First, get the existing land ad to access current images
            const existingLand = await LandAd.findById(id);
            if (!existingLand) {
                throw new Error('Land ad not found');
            }

            let imageUrls: string[] = [];

            // If new images are provided, upload them
            if (imageFiles && imageFiles.length > 0) {
                // Delete old images from Cloudinary if they exist
                if (existingLand.images && existingLand.images.length > 0) {
                    await UploadService.deleteImagesByUrls(existingLand.images);
                }

                // Upload new images
                imageUrls = await UploadService.uploadImages(imageFiles);
            } else {
                // Keep existing images if no new images provided
                imageUrls = existingLand.images || [];
            }

            // Update the land ad with new data and images
            const updatedData = {
                ...data,
                images: imageUrls,
            };

            return await LandAd.findByIdAndUpdate(id, updatedData, { new: true });
        } catch (error) {
            console.error('Error updating land:', error);
            throw error;
        }
    }

    // Delete a land ad by ID (also delete associated images from Cloudinary)
    static async deleteLand(id: string) {
        try {
            // First, get the land ad to access its images
            const landAd = await LandAd.findById(id);
            if (!landAd) {
                return null;
            }

            // Delete images from Cloudinary if they exist
            if (landAd.images && landAd.images.length > 0) {
                await UploadService.deleteImagesByUrls(landAd.images);
            }

            // Delete the land ad from database
            return await LandAd.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error deleting land:', error);
            throw error;
        }
    }

    // Additional method: Update only images for a land ad
    static async updateLandImages(id: string, imageFiles: Express.Multer.File[]) {
        try {
            const existingLand = await LandAd.findById(id);
            if (!existingLand) {
                throw new Error('Land ad not found');
            }

            // Delete old images from Cloudinary
            if (existingLand.images && existingLand.images.length > 0) {
                await UploadService.deleteImagesByUrls(existingLand.images);
            }

            // Upload new images
            const newImageUrls = await UploadService.uploadImages(imageFiles);

            // Update only the images field
            return await LandAd.findByIdAndUpdate(
                id,
                { images: newImageUrls },
                { new: true }
            );
        } catch (error) {
            console.error('Error updating land images:', error);
            throw error;
        }
    }

    // Additional method: Remove specific images from a land ad
    static async removeImagesFromLand(id: string, imageUrlsToRemove: string[]) {
        try {
            const existingLand = await LandAd.findById(id);
            if (!existingLand) {
                throw new Error('Land ad not found');
            }

            // Delete specific images from Cloudinary
            await UploadService.deleteImagesByUrls(imageUrlsToRemove);

            // Remove URLs from the images array
            const updatedImages = existingLand.images.filter(
                imageUrl => !imageUrlsToRemove.includes(imageUrl)
            );

            // Update the land ad with remaining images
            return await LandAd.findByIdAndUpdate(
                id,
                { images: updatedImages },
                { new: true }
            );
        } catch (error) {
            console.error('Error removing images from land:', error);
            throw error;
        }
    }
}