// backend\routes\productRoutes.js

// External Imports
import express from 'express';

// Internal Imports
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Router Initialization
const router = express.Router();

// Product Routes
// Top Products Route
router.get('/top', getTopProducts);

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Product Reviews Route
router.route('/:id/reviews').post(protect, createProductReview);

// Export Router
export default router;
