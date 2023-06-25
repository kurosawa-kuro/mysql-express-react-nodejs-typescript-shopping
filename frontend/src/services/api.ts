// frontend\src\services\api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

import { getApiClient } from "./apiClient";
import {
  UserUpdate,
  UserCredentials,
  UserRegisterCredentials,
  ProductSearch,
  ErrorMessage,
  Order,
  ProductDetails,
  UserUpdateByAdmin,
  ProductFull,
} from "../../../backend/interfaces";

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
export const registerUserApi = (user: UserRegisterCredentials) =>
  performRequest(apiClient.post("/api/users/register", user));

export const loginUserApi = (credentials: UserCredentials) =>
  performRequest(apiClient.post("/api/users/login", credentials));

export const fetchUserProfileApi = () =>
  performRequest(apiClient.get("/api/users/profile"));

export const updateUserProfileApi = (user: UserUpdate) =>
  performRequest(apiClient.put("/api/users/profile", user));

export const logoutUserApi = () =>
  performRequest(apiClient.post("/api/users/logout"));

export const getUsersApi = () => performRequest(apiClient.get("/api/users"));

export const deleteUserApi = (id: number) =>
  performRequest(apiClient.delete(`/api/users/${id}`));

export const getUserDetailsApi = (userId: number) =>
  performRequest(apiClient.get(`/api/users/${userId}`));

export const updateUserApi = (user: UserUpdateByAdmin) =>
  performRequest(apiClient.put(`/api/users/${user.id}`, user));

// Product related APIs
export const getProductsApi = ({ keyword, pageNumber }: ProductSearch) =>
  performRequest(
    apiClient.get("/api/products", { params: { keyword, pageNumber } })
  );

export const getProductFullsApi = (productId: number) =>
  performRequest(apiClient.get(`/api/products/${productId}`));

export const createProductApi = (product: ProductDetails | null) =>
  performRequest(apiClient.post("/api/products", product));

export const updateProductApi = (product: ProductDetails) =>
  performRequest(apiClient.put(`/api/products/${product.id}`, product));

export const uploadProductImageApi = async (imageData: FormData) =>
  performRequest(apiClient.post("/api/upload", imageData));

export const deleteProductApi = async (productId: number) =>
  performRequest(apiClient.delete(`/api/products/${productId}`));

// Order related APIs
export const createOrderApi = (order: Order) =>
  performRequest(apiClient.post("/api/orders", order));

export const getOrderFullApi = (id: number) =>
  performRequest(apiClient.get(`/api/orders/${id}`));

export const payOrderApi = (orderId: number, details: any) =>
  performRequest(apiClient.put(`/api/orders/${orderId}/pay`, details));

export const deliverOrderApi = (orderId: number) =>
  performRequest(apiClient.put(`/api/orders/${orderId}/deliver`));

export const getMyOrdersApi = () =>
  performRequest(apiClient.get("/api/orders/mine"));

export const getOrdersApi = async () =>
  performRequest(apiClient.get("/api/orders"));

export const getTopProductsApi = async (): Promise<ProductFull[]> =>
  performRequest(apiClient.get("/api/products/top"));
