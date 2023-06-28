// backend\models\orderModel.ts

import { db } from "../database/prisma/prismaClient";
import { Order } from "@prisma/client";
import { Cart, OrderFull } from "../interfaces";

export const createOrder = async (
  userId: number,
  orderData: any,
  cart: Cart[]
): Promise<OrderFull | null> => {
  const { shipping, paymentMethod, price } = orderData;

  const order = await db.order.create({
    data: {
      userId,
      address: shipping.address,
      city: shipping.city,
      postalCode: shipping.postalCode,
      paymentMethod,
      itemsPrice: parseFloat(price.itemsPrice),
      taxPrice: parseFloat(price.taxPrice),
      shippingPrice: parseFloat(price.shippingPrice),
      totalPrice: parseFloat(price.totalPrice),
      orderProducts: {
        create: cart.map((orderProduct) => ({
          productId: orderProduct.product.id,
          qty: orderProduct.qty,
        })),
      },
    },
    include: {
      orderProducts: true,
      user: true,
    },
  });

  const OrderFull: OrderFull = {
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  };

  return OrderFull;
};

export const findOrderByIdInDB = async (
  id: number
): Promise<OrderFull | null> => {
  const order = await db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } },
  });

  if (!order) {
    return null;
  }

  const OrderFull: OrderFull = {
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  };
  return OrderFull;
};

export const getUserOrdersFromDB = async (
  userId: number
): Promise<OrderFull[] | null> => {
  const ordersData = await db.order.findMany({
    where: { userId },
    include: {
      orderProducts: {
        include: { product: true },
      },
      user: true,
    },
  });

  const OrderFullList: OrderFull[] = ordersData.map((order) => ({
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  }));

  return OrderFullList;
};

export const getOrderByIdFromDB = async (
  orderId: number
): Promise<OrderFull | null> => {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: true, orderProducts: { include: { product: true } } },
  });
  if (!order) {
    return null;
  }

  const OrderFull: OrderFull = {
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  };

  return OrderFull;
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

export const getAllOrders = async () => {
  const orders = await db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } },
    },
  });

  const OrderFull: OrderFull[] = orders.map((order) => ({
    id: order.id,
    orderProducts: order.orderProducts,
    price: {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
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
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    },
  }));

  return OrderFull;
};
