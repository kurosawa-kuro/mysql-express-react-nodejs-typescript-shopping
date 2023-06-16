import request from "supertest";
import { app } from "../../index";

const loginUserAndGetToken = async (
  agent: request.SuperAgentTest,
  email: string,
  password: string
): Promise<string> => {
  const loginResponse = await agent
    .post("/api/users/login")
    .send({ email, password });

  if (loginResponse.status !== 200) {
    throw new Error("Login failed during test setup");
  }

  const match = loginResponse.headers["set-cookie"][0].match(/jwt=([^;]+)/);
  if (!match) {
    throw new Error("Failed to extract token from cookie");
  }

  return match[1];
};

describe("DELETE /api/products/:id", () => {
  let agent: request.SuperAgentTest;
  let token: string;

  beforeEach(async () => {
    agent = request.agent(app);
    token = await loginUserAndGetToken(agent, "admin@email.com", "123456");
  });

  it("deletes a product when admin is logged in", async () => {
    const id = 8;
    const response = await agent
      .delete(`/api/products/${id}`)
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Product removed" });
  });
});
