// frontend\src\services\api.js

import { getApiClient } from './apiClient';

const apiClient = getApiClient();

// Helper function to handle errors
const handleApiError = (error) => {
    if (error.response) {
        throw new Error(error.response.data.message);
    } else if (error.request) {
        throw new Error('Unable to connect to the server. Please try again.');
    } else {
        throw new Error('An error occurred. Please try again.');
    }
};

export const registerUserApi = async (user) => {
    try {
        const response = await apiClient.post('/api/users/register', user);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const loginUserApi = async (credentials) => {
    try {
        const response = await apiClient.post('/api/users/login', credentials);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchUserProfileApi = async () => {
    try {
        const response = await apiClient.get('/api/users/profile');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUserProfileApi = async (user) => {
    try {
        const response = await apiClient.put('/api/users/profile', user);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const logoutUserApi = async () => {
    try {
        const response = await apiClient.post('/api/users/logout');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getUsersApi = async () => {
    try {
        const response = await apiClient.get('/api/users');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteUserApi = async (id) => {
    try {
        const response = await apiClient.delete(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
export const getUserDetailsApi = async (userId) => {
    try {
        const response = await apiClient.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUserApi = async ({ userId, name, email, isAdmin }) => {
    try {
        const response = await apiClient.put(`/api/users/${userId}`, { name, email, isAdmin });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getProductsApi = async ({ keyword, pageNumber }) => {
    try {
        const response = await apiClient.get('/api/products', { params: { keyword, pageNumber } });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getProductDetailsApi = async (productId) => {
    try {
        const response = await apiClient.get(`/api/products/${productId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createProductApi = async (product) => {
    try {
        const response = await apiClient.post('/api/products', product);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateProductApi = async ({ productId, ...productData }) => {
    try {
        const response = await apiClient.put(`/api/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const uploadProductImageApi = async (imageData) => {
    try {
        const response = await apiClient.post('/api/upload', imageData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteProductApi = async (productId) => {
    try {
        const response = await apiClient.delete(`/api/products/${productId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createReviewApi = async ({ productId, ...reviewData }) => {
    try {
        const response = await apiClient.post(`/api/products/${productId}/reviews`, reviewData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const getTopProductsApi = async () => {
    try {
        const response = await apiClient.get('/api/products/top');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createOrderApi = async (order) => {
    try {
        const response = await apiClient.post('/api/orders', order);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const getOrderDetailsApi = async (id) => {
    try {
        const response = await apiClient.get(`${'/api/orders'}/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const payOrderApi = async ({ orderId, details }) => {
    try {
        const response = await apiClient.put(`${'/api/orders'}/${orderId}/pay`, details);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const getPaypalClientIdApi = async () => {
    try {
        const response = await apiClient.get('/api/config/paypal');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const getMyOrdersApi = async () => {
    try {
        const response = await apiClient.get(`${'/api/orders'}/mine`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const getOrdersApi = async () => {
    try {
        const response = await apiClient.get('/api/orders');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const deliverOrderApi = async (orderId) => {
    try {
        const response = await apiClient.put(`${'/api/orders'}/${orderId}/deliver`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}