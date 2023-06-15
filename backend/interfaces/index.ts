import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  User as UserType,
  Product as ProductType,
  Order as OrderType,
} from "@prisma/client";

// JWT and Request related interfaces
export interface DecodedJwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export interface RequestUser extends Request {
  user?: BaseUser;
}

// User related interfaces
export interface BaseUser
  extends Omit<UserType, "password" | "createdAt" | "updatedAt"> {}

export interface UserCredentials extends BaseUser {
  password: string;
}

export interface FullUser extends UserType {}

export interface OptionalUser extends BaseUser {
  password?: string;
}

export interface UserInfo extends BaseUser {
  token: string;
}

export interface RegisterUserCredentials extends UserCredentials {
  confirmPassword?: string;
}

export interface UserAuthStore {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

// Product related interfaces
export interface ProductBase
  extends Omit<
    ProductType,
    | "userId"
    | "brand"
    | "category"
    | "description"
    | "rating"
    | "numReviews"
    | "createdAt"
    | "updatedAt"
  > {}

export interface ProductDetail extends ProductType {}

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
export interface OrderDetails extends OrderType {
  orderProducts: ProductInCart[];
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface Order
  extends Omit<
    OrderType,
    | "id"
    | "userId"
    | "itemsPrice"
    | "taxPrice"
    | "shippingPrice"
    | "totalPrice"
    | "paymentResultId"
    | "paymentResultStatus"
    | "paymentResultUpdateTime"
    | "paymentResultEmail"
    | "paidAt"
    | "updatedAt"
  > {
  id?: number;
  userId?: number;
  user?: BaseUser;
  orderProducts: ProductInCart[];
  price: {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  paidAt: Date | null;
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
