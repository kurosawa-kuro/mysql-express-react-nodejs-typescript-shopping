// frontend\src\interfaces\index.ts

// Define common User properties
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

// Product interfaces
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

// Cart and Order interfaces

export interface Order extends ShippingAddress {
  id?: number;
  userId?: number;
  user?: BaseUser;
  orderProducts: ProductInCart[];
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  createdAt?: string;
}

// Other interfaces
export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface ErrorMessage {
  message: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
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
