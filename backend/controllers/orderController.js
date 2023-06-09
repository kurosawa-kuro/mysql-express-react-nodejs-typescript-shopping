// backend\controllers\orderController.js

import { db } from '../database/prisma/prismaClient.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Helper function to get order by ID with necessary includes
const findOrderById = async (id) => {
  return await db.order.findUnique({
    where: { id },
    include: { user: true, orderProducts: { include: { product: true } } }
  });
};

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const createdOrder = await db.order.create({
    data: {
      userId: req.user.id,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      paymentMethod: paymentMethod,
      itemsPrice: parseFloat(itemsPrice),
      taxPrice: parseFloat(taxPrice),
      shippingPrice: parseFloat(shippingPrice),
      totalPrice: parseFloat(totalPrice),
      orderProducts: {
        create: orderItems.map(item => ({
          productId: item.id,
          qty: item.qty
        })),
      }
    },
  });

  res.status(201).json(createdOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = Number(req.user.id);
  const orders = await db.order.findMany({
    where: { userId },
    include: {
      orderProducts: { include: { product: true } }
    }
  });

  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const order = await findOrderById(id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(order);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const order = await findOrderById(id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const updatedOrder = await db.order.update({
    where: { id },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResultId: req.body.id,
      paymentResultStatus: req.body.status,
      paymentResultUpdateTime: req.body.update_time,
      paymentResultEmail: req.body.payer.email_address,
    }
  });

  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const order = await findOrderById(id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const updatedOrder = await db.order.update({
    where: { id },
    data: {
      isDelivered: true,
      deliveredAt: new Date(),
    }
  });

  res.json(updatedOrder);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await db.order.findMany({
    include: {
      user: true,
      orderProducts: { include: { product: true } }
    }
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