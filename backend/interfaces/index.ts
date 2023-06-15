// backend\interfaces\index.ts

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType } from "@prisma/client";

// JWT and Request related interfaces
export interface DecodedJwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export interface RequestUser extends Request {
  user?: UserWithoutPassword;
}

// User related interfaces
export interface UserWithoutPassword extends Omit<UserType, "password"> {}

export interface BaseUser {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface FullUser extends BaseUser {
  password: string;
}

export interface OptionalUser extends BaseUser {
  password?: string;
}

export interface UserInfo extends BaseUser {
  token: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterUserCredentials extends UserCredentials {
  name: string;
  confirmPassword?: string;
}

export interface UserAuthStore {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

// Product related interfaces
export interface ProductBase {
  id: number;
  name: string;
  image: string;
  price: number;
  countInStock: number;
}

export interface ProductDetail extends ProductBase {
  userId?: number;
  brand: string;
  category: string;
  description: string;
  rating?: number;
  numReviews?: number;
}

export interface ProductInCart {
  product: ProductBase;
  qty: number;
}

export interface ProductSearchParams {
  keyword: string;
  pageNumber: number;
}

export interface ProductResponse {
  products: ProductDetail[];
  page: number;
  pages: number;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

// Order related interfaces
export interface OrderItems {
  product: ProductBase;
  qty: number;
}

export interface OrderDetails {
  id: number;
  orderProducts: OrderItems[];
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

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface Order extends ShippingAddress {
  id?: number;
  userId?: number;
  user?: BaseUser;
  orderProducts: ProductInCart[];
  paymentMethod: string;
  price: {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  createdAt?: string;
}

// Payment and Cart related interfaces
export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface CartStoreState {
  cartItems: ProductInCart[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface CartStoreActions {
  addToCart: (item: ProductInCart) => void;
  removeFromCart: (id: number) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  clearCartItems: () => void;
}

// Other interfaces
export interface ErrorMessage {
  message: string;
}
