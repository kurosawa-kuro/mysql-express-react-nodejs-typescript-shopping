// backend/routes/orderRoutes.js

// External Imports
import express from "express";

// Middleware Imports
import { protect, admin } from "../middleware/authMiddleware";

// Controller Imports
import {
  createOrder,
  readMyOrders,
  readAllOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController";

// Router Initialization
export const router = express.Router();

// Order Routes
router.route("/").post(protect, createOrder).get(protect, admin, readAllOrders);

router.route("/mine").get(protect, readMyOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
