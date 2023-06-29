import request from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  loginUserAndGetToken,
  createUserInDB,
  createProduct,
} from "../test-utils";
import { Product, User } from "@prisma/client";
import { OrderData } from "../../interfaces";

let token: string;
let product: Product;
let user: User;

beforeAll(async () => {
  await clearDatabase();
  user = await createUserInDB("testuser@example.com", "TestUserPassword123");
  product = await createProduct();

  const agent = request.agent(app);
  token = await loginUserAndGetToken(
    agent,
    "testuser@example.com",
    "TestUserPassword123"
  );
});

describe("Order Controller", () => {
  test("POST /api/orders/ - Should create a new order", async () => {
    const orderRequest: OrderData = {
      userId: user.id,
      cart: [
        {
          product,
          qty: 1,
        },
      ],
      shipping: {
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
      },
      paymentMethod: "Test Payment Method",
      price: {
        itemsPrice: product.price,
        taxPrice: 0.1 * product.price,
        shippingPrice: 10,
        totalPrice: 1.1 * product.price + 10,
      },
    };

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", `jwt=${token}`)
      .send(orderRequest);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.user.id).toBe(user.id);
    expect(response.body.shipping.address).toBe(orderRequest.shipping.address);
    expect(response.body.paymentMethod).toBe(orderRequest.paymentMethod);
    expect(response.body.price.itemsPrice).toBe(orderRequest.price.itemsPrice);
    expect(response.body.status.isPaid).toBe(false);
  });

  // test("POST /api/orders/ - Should fail if no order items", async () => {
  //   const response = await request(app)
  //     .post("/api/orders")
  //     .set("Cookie", `jwt=${token}`)
  //     .send({
  //       orderProducts: [],
  //       address: "123 Test St",
  //       city: "Test City",
  //       postalCode: "12345",
  //       paymentMethod: "Test Payment Method",
  //       price: {
  //         itemsPrice: 0,
  //         taxPrice: 0,
  //         shippingPrice: 10,
  //         totalPrice: 10,
  //       },
  //     });

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toEqual("No order items");
  // });
});

// describe("Order Controller - User Authentication", () => {
//   test("POST /api/orders/ - Should fail if user is not authenticated", async () => {
//     const response = await request(app)
//       .post("/api/orders")
//       .send({
//         orderProducts: [
//           {
//             product,
//             qty: 1,
//           },
//         ],
//         address: "123 Test St",
//         city: "Test City",
//         postalCode: "12345",
//         paymentMethod: "Test Payment Method",
//         price: {
//           itemsPrice: product.price,
//           taxPrice: 0.1 * product.price,
//           shippingPrice: 10,
//           totalPrice: 1.1 * product.price + 10,
//         },
//       });
//     expect(response.status).toBe(401);
//     expect(response.body.message).toEqual("Not authorized, no token");
//   });

//   test("GET /api/orders/mine - Should fail if user is not authenticated", async () => {
//     const response = await request(app).get("/api/orders/mine");

//     expect(response.status).toBe(401);
//     expect(response.body.message).toEqual("Not authorized, no token");
//   });
// });
