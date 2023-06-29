import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import {
  clearDatabase,
  createUserInDB,
  loginUserAndGetToken,
  createProduct,
  createProductAndOrder,
} from "../test-utils";
import { Product, User } from "@prisma/client";

describe("updateOrderToPaid", () => {
  let agent: SuperAgentTest;
  let token: string;
  let user: User;
  let product: Product;
  let order: any;

  beforeAll(async () => {
    agent = request.agent(app);
    await clearDatabase();
    user = await createUserInDB("test@test.com", "testpassword");
    token = await loginUserAndGetToken(agent, "test@test.com", "testpassword");
    order = await createProductAndOrder("test@test.com");
  });

  it("should return 401 when no token is provided", async () => {
    const response = await agent.put(`/api/orders/${order.id}/pay`);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Not authorized, no token");
  });

  it("should return 404 when the order is not found", async () => {
    const response = await agent
      .put(`/api/orders/0/pay`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Order not found");
  });

  it("should return 200 and update the order to paid when the order exists", async () => {
    const response = await agent
      .put(`/api/orders/${order.id}/pay`)
      .set("Cookie", `jwt=${token}`)
      .send({
        isPaid: true,
        update_time: "2023-06-17T09:30:00Z",
        payer: {
          email_address: "test@test.com",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.isPaid).toBe(true);
  });
});
