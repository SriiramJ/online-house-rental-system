import type { Request, Response } from "express";
import { upload } from "../middlewares/upload.middleware.ts";
import logger from "../utils/logger.ts";

export const uploadPropertyImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Generate URLs for uploaded files
    const imageUrls = files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/properties/${file.filename}`;
    });

    logger.info(`Uploaded ${files.length} property images`);
    
    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageUrls
    });
  } catch (error: any) {
    logger.error(`Error uploading images: ${error.message}`);
    res.status(500).json({
      message: "Failed to upload images",
      error: error.message
    });
  }
};