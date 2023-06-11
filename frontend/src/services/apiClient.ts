// frontend\src\services\apiClient.ts

import axios, { AxiosInstance } from "axios";

export const getApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  return apiClient;
};
