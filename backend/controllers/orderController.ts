// backend\controllers\orderController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";

// Internal Imports
import { Order } from "@prisma/client";
import { UserRequest, OrderFull } from "../interfaces";
import {
  createOrder,
  findOrderByIdInDB,
  getUserOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderToPaidInDB,
  updateOrderDeliveredStatus,
  getAllOrders,
} from "../models/orderModel";

const findOrderById = async (id: number) => {
  return findOrderByIdInDB(id);
};

export const addOrderItems = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { cart, ...orderData } = req.body;
    if (!cart || cart.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    if (req.user && req.user.id) {
      const createdOrder = await createOrder(
        Number(req.user.id),
        orderData,
        cart
      );
      res.status(201).json(createdOrder);
    }
  }
);

const getMyOrders = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.id) {
      const userId = Number(req.user.id);
      const orders = await getUserOrdersFromDB(userId);

      res.json(orders);
    }
  }
);

const getOrderById = asyncHandler(async (req: UserRequest, res: Response) => {
  const order = await getOrderByIdFromDB(Number(req.params.id));
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const OrderFull: OrderFull = {
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.price.itemsPrice,
      taxPrice: order.price.taxPrice,
      shippingPrice: order.price.shippingPrice,
      totalPrice: order.price.totalPrice,
    },
    paymentMethod: order.paymentMethod,
    status: {
      isPaid: order.status.isPaid,
      paidAt: order.status.paidAt,
      isDelivered: order.status.isDelivered,
      deliveredAt: order.status.deliveredAt,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    user: {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      isAdmin: order.user.isAdmin,
    },
    shipping: {
      address: order.shipping.address,
      city: order.shipping.city,
      postalCode: order.shipping.postalCode,
    },
  };
  res.json(OrderFull);
});

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await findOrderById(Number(req.params.id));

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const updatedOrder = await updateOrderToPaidInDB(order.id);

  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await findOrderById(Number(req.params.id));

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const updatedOrder: Order = await updateOrderDeliveredStatus(order.id);

    res.json(updatedOrder);
  }
);

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  res.json(orders);
});

export {
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
