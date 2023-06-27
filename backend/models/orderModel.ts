// backend\models\orderModel.ts

import { db } from "../database/prisma/prismaClient"; // あなたのデータベースインスタンスへのパスを適切に設定してください
import { CartProduct } from "../interfaces"; // あなたのインターフェースへのパスを適切に設定してください

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
