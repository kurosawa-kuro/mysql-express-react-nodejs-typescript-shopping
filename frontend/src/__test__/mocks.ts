import { Product } from "@prisma/client";
import { OrderInfo } from "../../../backend/interfaces";

// const testDate = new Date("2023-06-29T14:23:38.957Z");
// const testDateISOString = "2023-06-29T14:23:38.957Z";

export const product: Product = {
  id: 1,
  userId: 1,
  name: "Product 1",
  image: "https://example.com/product-1.jpg",
  description: "Description: This is product 1",
  brand: "Brand 1",
  category: "Category 1",
  price: 19.99,
  countInStock: 10,
  rating: 4.5,
  numReviews: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const postProductData: Product = {
  id: 2,
  userId: 1,
  name: "Product 2",
  image: "https://example.com/product-1.jpg",
  description: "Description: This is product 1",
  brand: "Brand 1",
  category: "Category 1",
  price: 19.99,
  countInStock: 10,
  rating: 4.5,
  numReviews: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const order: OrderInfo = {
  id: 28,
  shipping: {
    address: "大通り公園",
    city: "0600061",
    postalCode: "札幌",
  },
  paymentMethod: "PayPal",
  price: {
    itemsPrice: 89.99,
    taxPrice: 13.5,
    shippingPrice: 10,
    totalPrice: 113.49,
  },
  status: {
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    id: 2,
    name: "john",
    email: "john@email.com",
    isAdmin: false,
  },
  orderProducts: [
    {
      orderId: 28,
      productId: 1,
      qty: 1,
      product: {
        id: 1,
        userId: 1,
        name: "Product 1",
        image: "https://example.com/product-1.jpg",
        description: "Description: This is product 1",
        brand: "Brand 1",
        category: "Category 1",
        price: 19.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
};
