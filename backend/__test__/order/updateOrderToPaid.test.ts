import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUser,
  loginUserAndGetToken,
  createProduct,
} from "../test-utils";

describe("updateOrderToPaid", () => {
  let agent: SuperAgentTest;
  let user: any;
  let token: string;
  let product: any;

  beforeAll(async () => {
    agent = request.agent(app);
    await clearDatabase();
    user = await createUser("test@test.com", "testpassword");
    token = await loginUserAndGetToken(agent, "test@test.com", "testpassword");
    product = await createProduct(user.id);
  });

  it("should return 401 when no token is provided", async () => {
    const response = await agent.put("/api/orders/1/pay");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Not authorized, no token");
  });

  it("should return 404 when the order is not found", async () => {
    const response = await agent
      .put("/api/orders/1/pay")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Order not found");
  });

  it("should return 200 and update the order to paid when the order exists", async () => {
    const order = await request(app)
      .post("/api/orders")
      .set("Cookie", `jwt=${token}`)
      .send({
        orderProducts: [
          {
            product,
            qty: 1,
          },
        ],
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        paymentMethod: "Test Payment Method",
        price: {
          itemsPrice: product.price,
          taxPrice: 0.1 * product.price,
          shippingPrice: 10,
          totalPrice: 1.1 * product.price + 10,
        },
      });

    const response = await agent
      .put(`/api/orders/${order.body.id}/pay`)
      .set("Cookie", `jwt=${token}`)
      .send({
        id: order.body.id,
        isPaid: true,
        update_time: "2023-06-17T09:30:00Z",
        payer: {
          email_address: "test@test.com",
        },
      });

    if (response.status === 500) {
      console.log(response.body); // Here we log the server error
    }

    expect(response.status).toBe(200);
    // Rest of your test assertions
  });
});
