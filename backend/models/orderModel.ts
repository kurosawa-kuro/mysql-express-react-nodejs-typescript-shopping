// backend\models\orderModel.ts

import { db } from "../database/prisma/prismaClient"; // あなたのデータベースインスタンスへのパスを適切に設定してください
import { Order } from "@prisma/client";
import { CartProduct, OrderFull } from "../interfaces"; // あなたのインターフェースへのパスを適切に設定してください

export const createOrder = async (
  userId: number,
  orderData: any,
  orderProducts: CartProduct[]
) => {
  const { address, city, postalCode, paymentMethod, price } = orderData;

  const createdOrder = await db.order.create({
    data: {
      userId,
      address,
      city,
      postalCode,
      paymentMethod,
      itemsPrice: parseFloat(price.itemsPrice),
      taxPrice: parseFloat(price.taxPrice),
      shippingPrice: parseFloat(price.shippingPrice),
      totalPrice: parseFloat(price.totalPrice),
      orderProducts: {
        create: orderProducts.map((orderProduct) => ({
          productId: orderProduct.product.id,
          qty: orderProduct.qty,
        })),
      },
    },
    include: {
      orderProducts: true,
    },
  });

  return createdOrder;
};

export const findOrderByIdInDB = async (
  id: number
): Promise<OrderFull | null> => {
  return db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } },
  });
};

export const getUserOrdersFromDB = async (
  userId: number
): Promise<OrderFull[]> => {
  const orders: OrderFull[] = await db.order.findMany({
    where: { userId },
    include: {
      orderProducts: { include: { product: true } },
    },
  });

  return orders;
};

export const getOrderByIdFromDB = async (
  orderId: number
): Promise<OrderFull | null> => {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: true, orderProducts: { include: { product: true } } },
  });

  return order;
};

export const updateOrderToPaidInDB = async (
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

export const updateOrderDeliveredStatus = async (
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

export const getAllOrders = async (): Promise<OrderFull[]> => {
  return db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } },
    },
  });
};
