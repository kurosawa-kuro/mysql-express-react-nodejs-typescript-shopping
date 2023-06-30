// frontend\src\services\api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

import { getApiClient } from "./apiClient";
import {
  UserInfo,
  UserData,
  ProductSearch,
  ErrorMessage,
  ProductData,
  OrderData,
} from "../../../backend/interfaces";
import { Product } from "@prisma/client";

const apiClient = getApiClient();

const handleApiError = (error: AxiosError<ErrorMessage>) => {
  if (error.response) {
    throw new Error(error.response.data.message);
  } else if (error.request) {
    throw new Error("Unable to connect to the server. Please try again.");
  }
};

const performRequest = async (request: Promise<AxiosResponse<any>>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    if (error instanceof axios.AxiosError) {
      handleApiError(error);
    }
  }
};

// User related APIs
export const registerUser = (user: UserData) =>
  performRequest(apiClient.post("/api/users/register", user));

export const loginUser = (credentials: UserInfo) =>
  performRequest(apiClient.post("/api/users/login", credentials));

export const readUserProfile = () =>
  performRequest(apiClient.get("/api/users/profile"));

export const readAllUsers = () => performRequest(apiClient.get("/api/users"));

export const readUserById = (userId: number) =>
  performRequest(apiClient.get(`/api/users/${userId}`));

export const updateUserProfile = (user: UserInfo) =>
  performRequest(apiClient.put("/api/users/profile", user));

export const updateUser = (user: UserInfo) =>
  performRequest(apiClient.put(`/api/users/${user.id}`, user));

export const deleteUser = (id: number) =>
  performRequest(apiClient.delete(`/api/users/${id}`));

export const logoutUser = () =>
  performRequest(apiClient.post("/api/users/logout"));

// Product related APIs
export const createProduct = (product: ProductData | null) =>
  performRequest(apiClient.post("/api/products", product));

export const readProducts = ({ keyword, pageNumber }: ProductSearch) =>
  performRequest(
    apiClient.get("/api/products", { params: { keyword, pageNumber } })
  );

export const readProductById = (productId: number): Promise<Product | null> =>
  performRequest(apiClient.get(`/api/products/${productId}`));

export const updateProduct = (product: ProductData) =>
  performRequest(apiClient.put(`/api/products/${product.id}`, product));

export const deleteProduct = async (productId: number) =>
  performRequest(apiClient.delete(`/api/products/${productId}`));

export const getTopProducts = async (): Promise<Product[]> =>
  performRequest(apiClient.get("/api/products/top"));

export const uploadProductImage = async (imageData: FormData) =>
  performRequest(apiClient.post("/api/upload", imageData));

// Order related APIs
export const createOrder = (order: OrderData) =>
  performRequest(apiClient.post("/api/orders", order));

export const readOrderById = (id: number) =>
  performRequest(apiClient.get(`/api/orders/${id}`));

export const readMyOrders = () =>
  performRequest(apiClient.get("/api/orders/mine"));

export const readAllOrders = async () =>
  performRequest(apiClient.get("/api/orders"));

export const updateOrderToPaid = (orderId: number, details: any) =>
  performRequest(apiClient.put(`/api/orders/${orderId}/pay`, details));

export const updateOrderToDelivered = (orderId: number) =>
  performRequest(apiClient.put(`/api/orders/${orderId}/deliver`));
