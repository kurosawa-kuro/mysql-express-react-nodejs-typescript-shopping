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
    console.log("hit cont getMyOrders");
    if (req.user && req.user.id) {
      const userId = Number(req.user.id);
      const orders = await getUserOrdersFromDB(userId);

      res.json(orders);
    }
  }
);

const getOrderById = asyncHandler(async (req: UserRequest, res: Response) => {
  console.log("hit getOrderById");
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
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
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
  console.log({ OrderFull });
  // Todo:形式調整
  res.json(OrderFull);
});

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await findOrderById(Number(req.params.id));
  // if (!order) {
  //   res.status(404);
  //   throw new Error("Order not found");
  // }

  // const updatedOrder = await updateOrderToPaidInDB(order.id);

  // res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await findOrderById(Number(req.params.id));

    // if (!order) {
    //   res.status(404);
    //   throw new Error("Order not found");
    // }

    // const updatedOrder: Order = await updateOrderDeliveredStatus(order.id);

    // res.json(updatedOrder);
  }
);

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  console.log("hit cont getOrders");
  const orders = await getAllOrders();

  // res.json(
  //   orders.map((order) => ({
  //     ...order,
  //     price: {
  //       itemsPrice: order.itemsPrice,
  //       shippingPrice: order.shippingPrice,
  //       taxPrice: order.taxPrice,
  //       totalPrice: order.totalPrice,
  //     },
  //   }))
  // );
});

export {
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
