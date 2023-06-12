// frontend\src\interfaces\index.ts

export interface FullUser {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface OptionalUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

export interface LoginUserCredentials {
  email: string;
  password: string;
}

export interface RegisterUserCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserAuthStore {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

export interface Product {
  id: number;
  userId: number;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

export interface ProductSearchParams {
  keyword: string;
  pageNumber: string;
}

export interface ProductResponse {
  products: Product[];
  page: number;
  pages: number;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
  product: Product;
}
export interface Order {
  id?: number;
  userId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  orderProducts: CartItem[];
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
}

export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface ErrorMessage {
  message: string;
}

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface CartStoreState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface CartStoreActions {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  clearCartItems: () => void;
}
