// backend/routes/productRoutes.js

// External Imports
import express from "express";

// Middleware Imports
import { protect, admin } from "../middleware/authMiddleware";

// Controller Imports
import {
  createProduct,
  readProductById,
  readProducts,
  readTopProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

// Router Initialization
export const router = express.Router();

// Top Products Route
router.get("/top", readTopProducts);

// Product Routes
router.route("/").get(readProducts).post(protect, admin, createProduct);

router
  .route("/:id")
  .get(readProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
