// Enhanced Upload Service with timeout handling and better error management
import { Request, Response } from 'express';
import {cloudinary} from "../utils/cloudinary";

export class UploadService {
    // Upload multiple images to cloudinary with timeout handling
    static async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        if (!files || files.length === 0) return [];

        console.log(`Starting upload of ${files.length} images...`);

        // Upload all images concurrently with timeout
        const uploadPromises = files.map(async (file, index) => {
            try {
                console.log(`Uploading image ${index + 1}/${files.length}: ${file.originalname}`);

                // Use buffer instead of file.path for more reliable uploads
                const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'land_ads',
                            transformation: [{ width: 800, height: 600, crop: 'limit' }],
                            resource_type: 'image',
                        },
                        (error, result) => {
                            if (error) {
                                console.error(`Cloudinary upload error for ${file.originalname}:`, error);
                                reject(new Error(`Upload failed: ${error.message}`));
                            } else if (result) {
                                resolve(result as { secure_url: string });
                            } else {
                                reject(new Error('Upload failed: No result returned'));
                            }
                        }
                    );
                    
                    uploadStream.end(file.buffer);
                });

                // Add timeout wrapper
                const resultWithTimeout = await Promise.race([
                    result,
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Upload timeout')), 45000)
                    )
                ]);

                console.log(`Successfully uploaded image ${index + 1}: ${result.secure_url}`);
                return result.secure_url;
            } catch (error: any) {
                console.error(`Failed to upload image ${index + 1}:`, error);
                throw new Error(`Failed to upload image ${file.originalname}: ${error?.message || 'Unknown error'}`);
            }
        });

        try {
            const results = await Promise.all(uploadPromises);
            console.log(`Successfully uploaded all ${results.length} images`);
            return results;
        } catch (error: any) {
            console.error('Batch upload error:', error);
            throw new Error(`Failed to upload images: ${error?.message || 'Unknown error'}`);
        }
    }

    // Extract public_id from cloudinary URL
    static extractPublicId(imageUrl: string): string {
        try {
            const parts = imageUrl.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex === -1) return '';

            // Get everything after 'upload/v123456/' and remove file extension
            const pathAfterVersion = parts.slice(uploadIndex + 2).join('/');
            return pathAfterVersion.replace(/\.[^/.]+$/, ''); // Remove file extension
        } catch (error: any) {
            console.error('Error extracting public_id:', error);
            return '';
        }
    }

    // Delete multiple images from cloudinary by URLs with timeout handling
    static async deleteImagesByUrls(imageUrls: string[]): Promise<void> {
        if (!imageUrls || imageUrls.length === 0) return;

        console.log(`Deleting ${imageUrls.length} images from Cloudinary...`);

        try {
            const deletePromises = imageUrls.map(async (url, index) => {
                const publicId = this.extractPublicId(url);
                if (publicId) {
                    console.log(`Deleting image ${index + 1}: ${publicId}`);
                    return await Promise.race([
                        cloudinary.uploader.destroy(publicId),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Delete timeout')), 10000)
                        )
                    ]);
                }
                return null;
            });

            await Promise.all(deletePromises);
            console.log(`Successfully deleted ${imageUrls.length} images from Cloudinary`);
        } catch (error: any) {
            console.error('Error deleting images from Cloudinary:', error);
            // Don't throw error to prevent blocking the main operation
        }
    }

    // Delete single image from cloudinary by URL
    static async deleteImageByUrl(imageUrl: string): Promise<void> {
        try {
            const publicId = this.extractPublicId(imageUrl);
            if (publicId) {
                await Promise.race([
                    cloudinary.uploader.destroy(publicId),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Delete timeout')), 10000)
                    )
                ]);
                console.log(`Deleted image: ${publicId}`);
            }
        } catch (error: any) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }
}