// backend\controllers\orderController.ts

// External Imports
import asyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import { Order } from "@prisma/client";
import { RequestUser, OrderItems } from "../interfaces";

const findOrderById = async (id: number): Promise<Order | null> => {
  return db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } },
  });
};

const addOrderItems = asyncHandler(
  async (req: RequestUser, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const createdOrder: Order = await db.order.create({
      data: {
        userId: Number(req.user.id),
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        paymentMethod: paymentMethod,
        itemsPrice: parseFloat(itemsPrice),
        taxPrice: parseFloat(taxPrice),
        shippingPrice: parseFloat(shippingPrice),
        totalPrice: parseFloat(totalPrice),
        orderProducts: {
          create: orderItems.map((item: OrderItems) => ({
            productId: item.id,
            qty: item.qty,
          })),
        },
      },
    });

    res.status(201).json(createdOrder);
  }
);

const getMyOrders = asyncHandler(
  async (req: RequestUser, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const userId = Number(req.user.id);
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        orderProducts: { include: { product: true } },
      },
    });

    res.json(orders);
  }
);

const getOrderById = asyncHandler(async (req: RequestUser, res: Response) => {
  const order = await findOrderById(Number(req.params.id));
  order
    ? res.json(order)
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
      paymentResultId: id,
      paymentResultStatus: status,
      paymentResultUpdateTime: update_time,
      paymentResultEmail: email_address,
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
  const orders: Order[] = await db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } },
    },
  });

  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
