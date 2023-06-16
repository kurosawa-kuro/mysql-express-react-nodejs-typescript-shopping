// backend/routes/productRoutes.js

// External Imports
import express from "express";

// Middleware Imports
import { protect, admin } from "../middleware/authMiddleware";

// Controller Imports
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/productController";

// Router Initialization
export const router = express.Router();

// Top Products Route
router.get("/top", getTopProducts);

// Product Routes
router.route("/").get(getProducts).post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
