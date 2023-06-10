// frontend\src\tests\App.test.js

import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from '../screens/product/HomeScreen';
import { getProductsApi } from '../services/api';

// Mock API
jest.mock('../services/api');

describe('HomeScreen', () => {
    it('renders products when fetch is successful', async () => {
        const products = [
            { id: '1', name: 'Product 1' },
            { id: '2', name: 'Product 2' }
        ];
        getProductsApi.mockResolvedValueOnce({ products, pages: 1, page: 1 });
        render(
            <HelmetProvider>
                <BrowserRouter>
                    <HomeScreen />
                </BrowserRouter>
            </HelmetProvider>
        );

        await waitFor(() => {
            products.forEach(product => {
                expect(screen.getByText(product.name)).toBeInTheDocument();
            });
        });
        // screen.debug();
    });
});
