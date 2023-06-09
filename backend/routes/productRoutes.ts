// backend\routes\productRoutes.js

// External Imports
import express from "express";

// Internal Imports
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from "../controllers/productController";
import { protect, admin } from "../middleware/authMiddleware";

// Router Initialization
const router = express.Router();

// Product Routes
// Top Products Route
router.get("/top", getTopProducts);

router.route("/").get(getProducts).post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Export Router
export default router;
