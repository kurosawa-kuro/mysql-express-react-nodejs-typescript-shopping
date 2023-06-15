import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  User as UserType,
  Product as ProductType,
  Order as OrderType,
} from "@prisma/client";

// --------------------------
// JWT and Request related interfaces

export interface UserDecodedJwtPayload extends JwtPayload {
  userId: string;
}

export interface UserRequest extends Request {
  user?: UserBase;
}

// --------------------------
// User related interfaces

export interface UserFull extends UserType {}
export interface UserBase
  extends Pick<UserType, "id" | "name" | "email" | "isAdmin"> {}

export interface UserUpdate
  extends Pick<UserType, "id" | "name" | "email" | "password" | "isAdmin"> {}

export interface UserUpdateByAdmin
  extends Pick<UserType, "id" | "name" | "email" | "isAdmin"> {}

export interface UserCredentials extends Pick<UserType, "email" | "password"> {}

export interface UserRegisterCredentials
  extends Pick<UserType, "name" | "email" | "password"> {
  confirmPassword?: string;
}

export interface UserInformation extends UserBase {
  token: string;
}

export interface UserAuth {
  UserInformation: UserInformation | null;
  setUserInformation: (UserInformation: UserInformation) => void;
  logout: () => void;
}

// --------------------------
// Product related interfaces
export interface ProductFull extends ProductType {}
export interface ProductBase
  extends Pick<
    ProductType,
    "id" | "name" | "image" | "price" | "countInStock"
  > {}

export interface CartProduct {
  product: ProductBase;
  qty: number;
}

export interface ProductSearch {
  keyword: string;
  pageNumber: number;
}

export interface ProductList {
  products: ProductFull[];
  page: number;
  pages: number;
}

export interface ProductDetails
  extends Pick<
    ProductType,
    | "id"
    | "name"
    | "image"
    | "brand"
    | "category"
    | "description"
    | "price"
    | "countInStock"
  > {}

export interface ProductReview {
  rating: number;
  comment: string;
}

// --------------------------
// Order related interfaces

export interface OrderFull extends OrderType {
  orderProducts: CartProduct[];
}

export interface Order
  extends Pick<
    OrderType,
    | "address"
    | "city"
    | "postalCode"
    | "paymentMethod"
    | "isPaid"
    | "isDelivered"
    | "deliveredAt"
    | "createdAt"
  > {
  id?: number;
  userId?: number;
  user?: UserBase;
  orderProducts: CartProduct[];
  price: {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  paidAt: Date | null;
}

export interface OrderShipping {
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
  cartItems: CartProduct[];
  shippingAddress: OrderShipping;
  paymentMethod: string;
}

export interface CartActions {
  addToCart: (item: CartProduct) => void;
  removeFromCart: (id: number) => void;
  saveOrderShipping: (address: OrderShipping) => void;
  savePaymentMethod: (method: string) => void;
  clearCartItems: () => void;
}

// --------------------------
// Other interfaces

export interface ErrorMessage {
  message: string;
}
