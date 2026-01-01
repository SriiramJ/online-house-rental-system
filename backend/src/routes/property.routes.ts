import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createProperty, getAllProperties, getPropertyById, updateProperty } from "../controllers/property.controller.js";
import { uploadPropertyImages } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// Protected routes (Owner only)
router.post("/", (req, res, next) => {
  console.log('=== PROPERTY ROUTE POST / ===');
  console.log('Request received at property route');
  next();
}, authMiddleware, roleMiddleware(['OWNER']), createProperty);
router.put("/:id", (req, res, next) => {
  console.log('=== PROPERTY ROUTE PUT /:id ===');
  console.log('Request received at property update route');
  next();
}, authMiddleware, roleMiddleware(['OWNER']), updateProperty);

// Upload routes
router.post("/upload-images", authMiddleware, roleMiddleware(['OWNER']), upload.array('images', 10), uploadPropertyImages);

export default router;