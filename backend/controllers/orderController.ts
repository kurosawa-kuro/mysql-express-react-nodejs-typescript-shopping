// backend\controllers\orderController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";

// Internal Imports
import { Order } from "@prisma/client";
import { UserRequest, OrderInfo, OrderData } from "../interfaces";
import {
  createOrderInDB,
  readOrderByIdFromDB,
  readUserOrdersFromDB,
  readAllOrdersFromDB,
  updateOrderAsPaidInDB,
  updateOrderAsDeliveredInDB,
} from "../models/orderModel";

const createOrder = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { shipping, paymentMethod, price, cart } = req.body;
    if (!cart || cart.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    if (req.user && req.user.id) {
      const userId = Number(req.user.id);
      const orderData: OrderData = {
        userId,
        shipping,
        paymentMethod,
        price,
        cart,
      };
      const createdOrder = await createOrderInDB(orderData);
      res.status(201).json(createdOrder);
    }
  }
);

const readMyOrders = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.id) {
      const userId = Number(req.user.id);
      const orders = await readUserOrdersFromDB(userId);

      res.json(orders);
    }
  }
);

const readAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await readAllOrdersFromDB();
  res.json(orders);
});

const readOrderById = asyncHandler(async (req: UserRequest, res: Response) => {
  const order = await readOrderByIdFromDB(Number(req.params.id));

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await readOrderByIdFromDB(Number(req.params.id));

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const updatedOrder = await updateOrderAsPaidInDB(order.id);

  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await readOrderByIdFromDB(Number(req.params.id));

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const updatedOrder: Order = await updateOrderAsDeliveredInDB(order.id);

    res.json(updatedOrder);
  }
);

export {
  createOrder,
  readMyOrders,
  readAllOrders,
  readOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
};
