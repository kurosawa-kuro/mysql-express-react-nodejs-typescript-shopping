export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
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

export interface Order {
  id: number;
  userId: number;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
}

export interface PaymentDetails {
  paymentResultId: string;
  paymentResultStatus: string;
  paymentResultUpdateTime: string;
  paymentResultEmail: string;
}

export interface ProductSearchParams {
  keyword: string;
  pageNumber: string;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

export interface ErrorMessage {
  message: string;
}
