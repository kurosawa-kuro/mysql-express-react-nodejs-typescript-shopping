// backend\controllers\orderController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import { Order } from "@prisma/client";
import { UserRequest, CartProduct, OrderFull } from "../interfaces";
import { createOrder } from "../models/orderModel";

const findOrderById = async (id: number): Promise<OrderFull | null> => {
  return db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } },
  });
};

export const addOrderItems = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const { orderProducts, ...orderData } = req.body;
    if (!orderProducts || orderProducts.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const createdOrder = await createOrder(
      Number(req.user.id),
      orderData,
      orderProducts
    );
    res.status(201).json(createdOrder);
  }
);

const getMyOrders = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const userId = Number(req.user.id);

    const orders: OrderFull[] = await db.order.findMany({
      where: { userId },
      include: {
        orderProducts: { include: { product: true } },
      },
    });

    res.json(
      orders.map((order) => ({
        ...order,
        price: {
          itemsPrice: order.itemsPrice,
          shippingPrice: order.shippingPrice,
          taxPrice: order.taxPrice,
          totalPrice: order.totalPrice,
        },
      }))
    );
  }
);

const getOrderById = asyncHandler(async (req: UserRequest, res: Response) => {
  const order = await findOrderById(Number(req.params.id));
  order
    ? res.json({
        id: order.id,
        orderProducts: order.orderProducts,
        price: {
          itemsPrice: order.itemsPrice,
          taxPrice: order.taxPrice,
          shippingPrice: order.shippingPrice,
          totalPrice: order.totalPrice,
        },
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        user: {
          id: order.user?.id,
          name: order.user?.name,
          email: order.user?.email,
          isAdmin: order.user?.isAdmin,
        },
        address: order.address,
        city: order.city,
        postalCode: order.postalCode,
      })
    : res.status(404).json({ message: "Order not found" });
});

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await findOrderById(Number(req.params.id));
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const {
    id,
    status,
    update_time,
    payer: { email_address },
  } = req.body;

  const updatedOrder: Order = await db.order.update({
    where: { id: order.id },
    data: {
      isPaid: true,
      paidAt: new Date(),
    },
  });

  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await findOrderById(Number(req.params.id));
    order
      ? res.json(
          await db.order.update({
            where: { id: order.id },
            data: {
              isDelivered: true,
              deliveredAt: new Date(),
            },
          })
        )
      : res.status(404).json({ message: "Order not found" });
  }
);

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders: OrderFull[] = await db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } },
    },
  });

  res.json(
    orders.map((order) => ({
      ...order,
      price: {
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
      },
    }))
  );
});

export {
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
