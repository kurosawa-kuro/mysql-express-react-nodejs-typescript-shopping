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

export interface UserBase
  extends Omit<UserType, "password" | "createdAt" | "updatedAt"> {}

export interface UserFull extends UserType {}

export interface OptionalUser extends UserBase {
  password?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegisterCredentials {
  name: string;
  email: string;
  password: string;
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

export interface ProductFull extends ProductType {}

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

export interface ProductDetails {
  id: number;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}

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
