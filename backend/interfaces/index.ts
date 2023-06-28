import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  User as UserType,
  Product as ProductType,
  Order as OrderType,
  OrderProduct,
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

export interface User extends UserType {}
export interface UserBase
  extends Pick<UserType, "id" | "name" | "email" | "isAdmin"> {}

export interface UserUpdate
  extends Pick<UserType, "id" | "name" | "email" | "password" | "isAdmin"> {}

export interface UserUpdateByAdmin
  extends Pick<UserType, "id" | "name" | "email" | "isAdmin"> {}

export interface UserLoginCredentials
  extends Pick<UserType, "email" | "password"> {}

export interface UserRegisterCredentials
  extends Pick<UserType, "name" | "email" | "password"> {
  confirmPassword?: string;
}

export interface UserInformation extends UserBase {
  token: string;
}

export interface UserAuth {
  userInformation: UserInformation | null;
  setUserInformation: (userInformation: UserInformation) => void;
  logout: () => void;
}

// --------------------------
// Product related interfaces
export interface Product extends ProductType {}

export interface ProductBase
  extends Pick<
    ProductType,
    | "id"
    | "name"
    | "image"
    | "brand"
    | "category"
    | "description"
    | "rating"
    | "numReviews"
    | "price"
    | "countInStock"
  > {}

export interface Cart {
  product: ProductBase;
  qty: number;
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

export interface Shipping {
  address: string;
  city: string;
  postalCode: string;
}

// --------------------------
// Order related interfaces
export interface Order extends OrderType {}

export interface OrderFullProduct {
  orderId: number;
  productId: number;
  qty: number;
  product: Product;
}

export interface OrderFull
  extends Pick<OrderType, "id" | "paymentMethod" | "createdAt" | "updatedAt"> {
  orderProducts: OrderFullProduct[];
  user: UserBase;
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

export interface OrderRequest extends Pick<OrderType, "paymentMethod"> {
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
// Payment and Cart related interfaces

export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface CartState {
  cartItems: Cart[];
  shippingAddress: Shipping;
  paymentMethod: string;
}

export interface CartActions {
  addToCart: (item: Cart) => void;
  removeFromCart: (id: number) => void;
  saveShipping: (address: Shipping) => void;
  savePaymentMethod: (method: string) => void;
  clearCartItems: () => void;
}

// --------------------------
// Other interfaces

export interface ErrorMessage {
  message: string;
}
