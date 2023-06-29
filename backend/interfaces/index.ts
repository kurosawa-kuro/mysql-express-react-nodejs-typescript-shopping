import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User, Product, Order } from "@prisma/client";

// --------------------------
// User related interfaces

export interface UserInfo extends Partial<User> {
  confirmPassword?: string;
  token?: string;
}

export interface UserData extends Pick<User, "name" | "email" | "password"> {
  id?: number;
}

export interface UserAuth {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

// --------------------------
// JWT and Request related interfaces

export interface UserDecodedJwtPayload extends JwtPayload {
  userId: string;
}

export interface UserRequest extends Request {
  user?: UserInfo;
}

// --------------------------
// Product related interfaces

export interface ProductData
  extends Pick<
    Product,
    | "name"
    | "image"
    | "brand"
    | "category"
    | "description"
    | "rating"
    | "numReviews"
    | "price"
    | "countInStock"
  > {
  id?: number;
}

export interface ProductSearch {
  keyword: string;
  pageNumber: number;
}

export interface ProductList {
  products: Product[];
  page: number;
  pages: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
}

export interface Cart {
  product: Product;
  qty: number;
}

// --------------------------
// Order related interfaces

export interface OrderProductInfo {
  orderId: number;
  productId: number;
  qty: number;
  product: Product;
}

export interface OrderInfo
  extends Pick<Order, "id" | "paymentMethod" | "createdAt" | "updatedAt"> {
  orderProducts: OrderProductInfo[];
  user: UserInfo;
  status: {
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
  };
  price: {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  shipping: Shipping;
}

export interface OrderData extends Pick<Order, "userId" | "paymentMethod"> {
  id?: number;
  cart: Cart[];
  price: {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  shipping: Shipping;
}

// --------------------------
// Shipping interface

export interface Shipping {
  address: string;
  city: string;
  postalCode: string;
}

// --------------------------
// Payment and Cart related interfaces

export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface CartState {
  cartItems: Cart[];
  shipping: Shipping;
  paymentMethod: string;
}

export interface CartActions {
  createCartItem: (item: Cart) => void;
  deleteCartItems: () => void;
  deleteCartItem: (id: number) => void;
  createShipping: (address: Shipping) => void;
  createPaymentMethod: (method: string) => void;
}

// --------------------------
// Other interfaces

export interface ErrorMessage {
  message: string;
}
