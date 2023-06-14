// backend\interfaces\index.ts

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType } from "@prisma/client";

export interface DecodedJwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export interface UserWithoutPassword extends Omit<UserType, "password"> {}

export interface RequestUser extends Request {
  user?: UserWithoutPassword;
}

export interface ProductBase {
  id: number;
  name: string;
  image: string;
  price: number;
  countInStock: number;
}

export interface OrderItems {
  product: ProductBase;
  qty: number;
}

export interface OrderDetails {
  id: number;
  orderProducts: {
    product: {
      id: number;
      name: string;
      image: string;
      price: number;
      countInStock: number;
    };
    qty: number;
  }[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  createdAt: Date;
}
