// frontend\src\services\apiClient.js

import axios from "axios";

export const getApiClient = () => {
    const apiClient = axios.create({
        baseURL: "http://localhost:5000",
        withCredentials: true,
    });

    return apiClient;
};

