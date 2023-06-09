// backend/routes/orderRoutes.js

// External Imports
import express from "express";

// Middleware Imports
import { protect, admin } from "../middleware/authMiddleware";

// Controller Imports
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController";

// Router Initialization
const router = express.Router();

// Order Routes
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.route("/mine").get(protect, getMyOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

// Export Router
export default router;
