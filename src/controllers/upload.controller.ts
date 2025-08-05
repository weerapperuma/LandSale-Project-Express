import { Request, Response } from 'express'

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded'
      });
    }

    const file = req.file as any;
    
    // Add file size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds limit',
        details: 'Maximum file size is 5MB'
      });
    }

    return res.json({
      success: true,
      imageUrl: file.path,
      publicId: file.filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}