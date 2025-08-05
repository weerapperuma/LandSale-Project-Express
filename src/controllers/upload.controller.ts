import { Request, Response } from 'express'

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.file as any
    return res.json({
      success: true,
      imageUrl: file.path,
      publicId: file.filename,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 