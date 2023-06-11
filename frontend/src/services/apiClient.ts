// frontend\src\services\apiClient.ts

import axios, { AxiosInstance } from "axios";

export const getApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  return apiClient;
};
