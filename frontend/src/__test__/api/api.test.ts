// frontend\src\services\__tests__\api.test.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getProductFullsApi } from '../../services/api';

const API_BASE_URL = "http://localhost:8080/api";
const product = {
    id: 1,
    name: "Test Product",
    image: "url-to-your-image",
    brand: "Test Brand",
    category: "Test Category",
    description: "Test Description",
    price: 100,
    countInStock: 10,
};

const server = setupServer(
    rest.get(`${API_BASE_URL}/products/:id`, (_req, res, ctx) => {
        return res(ctx.json(product));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('getProductFullsApi returns product data', async () => {
    const data = await getProductFullsApi(product.id);

    expect(data).toEqual(product);
});
