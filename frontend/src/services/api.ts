// frontend\src\services\api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

import { getApiClient } from "./apiClient";
import {
  User,
  ProductSearchParams,
  Product,
  ErrorMessage,
} from "../interfaces";

const apiClient = getApiClient();

const handleApiError = (error: AxiosError<ErrorMessage>) => {
  if (error.response) {
    throw new Error(error.response.data.message);
  } else if (error.request) {
    throw new Error("Unable to connect to the server. Please try again.");
  } else {
    throw new Error("An error occurred. Please try again.");
  }
};

const performRequest = async (request: Promise<AxiosResponse<any>>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    if (error instanceof axios.AxiosError) {
      handleApiError(error);
    } else {
      throw error;
    }
  }
};

export const registerUserApi = (user: User) =>
  performRequest(apiClient.post("/api/users/register", user));

export const loginUserApi = (credentials: {
  email: string;
  password: string;
}) => performRequest(apiClient.post("/api/users/login", credentials));

export const fetchUserProfileApi = () =>
  performRequest(apiClient.get("/api/users/profile"));

export const updateUserProfileApi = (user: User) =>
  performRequest(apiClient.put("/api/users/profile", user));

export const logoutUserApi = () =>
  performRequest(apiClient.post("/api/users/logout"));

export const getUsersApi = () => performRequest(apiClient.get("/api/users"));

export const deleteUserApi = (id: number) =>
  performRequest(apiClient.delete(`/api/users/${id}`));

export const getUserDetailsApi = (userId: number) =>
  performRequest(apiClient.get(`/api/users/${userId}`));

export const updateUserApi = (user: User) =>
  performRequest(apiClient.put(`/api/users/${user.id}`, user));

export const getProductsApi = ({ keyword, pageNumber }: ProductSearchParams) =>
  performRequest(
    apiClient.get("/api/products", { params: { keyword, pageNumber } })
  );

export const getProductDetailsApi = (productId: number) =>
  performRequest(apiClient.get(`/api/products/${productId}`));

export const createProductApi = (product: Product) =>
  performRequest(apiClient.post("/api/products", product));

export const updateProductApi = (product: Product) =>
  performRequest(apiClient.put(`/api/products/${product.id}`, product));
