// backend\models\orderModel.ts

import { db } from "../database/prisma/prismaClient";
import { Order } from "@prisma/client";
import { OrderData, OrderInfo } from "../interfaces";

const _createOrderInfoFromOrder = (order: any): OrderInfo => {
  return {
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
    },
    paymentMethod: order.paymentMethod,
    status: {
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  };
};

export const createOrderInDB = async (
  orderData: OrderData
): Promise<OrderInfo | null> => {
  const { userId, shipping, paymentMethod, price, cart } = orderData;

  const order = await db.order.create({
    data: {
      userId,
      address: shipping.address,
      city: shipping.city,
      postalCode: shipping.postalCode,
      paymentMethod,
      itemsPrice: price.itemsPrice,
      taxPrice: price.taxPrice,
      shippingPrice: price.shippingPrice,
      totalPrice: price.totalPrice,
      orderProducts: {
        create: cart.map((cartItem) => ({
          productId: cartItem.product.id,
          qty: cartItem.qty,
        })),
      },
    },
    include: {
      orderProducts: true,
      user: true,
    },
  });

  return _createOrderInfoFromOrder(order);
};

export const readOrderByIdFromDB = async (
  id: number
): Promise<OrderInfo | null> => {
  const order = await db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } },
  });

  if (!order) {
    return null;
  }

  return _createOrderInfoFromOrder(order);
};

export const readUserOrdersFromDB = async (
  userId: number
): Promise<OrderInfo[] | null> => {
  const orders = await db.order.findMany({
    where: { userId },
    include: {
      orderProducts: {
        include: { product: true },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(_createOrderInfoFromOrder);
};

export const readAllOrdersFromDB = async () => {
  const orders = await db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map(_createOrderInfoFromOrder);
};

export const updateOrderAsPaidInDB = async (
  orderId: number
): Promise<Order> => {
  const updatedOrder: Order = await db.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
    },
  });

  return updatedOrder;
};

export const updateOrderAsDeliveredInDB = async (
  orderId: number
): Promise<Order> => {
  const updatedOrder: Order = await db.order.update({
    where: { id: orderId },
    data: {
      isDelivered: true,
      deliveredAt: new Date(),
    },
  });

  return updatedOrder;
};
