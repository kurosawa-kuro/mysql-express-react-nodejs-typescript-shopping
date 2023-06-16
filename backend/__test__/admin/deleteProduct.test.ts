import request from "supertest";
import { app } from "../../index"; // app should be exported from your express app

describe("DELETE /api/products/:id", () => {
  let agent: request.SuperAgentTest;
  let token: string;
  beforeEach(async () => {
    agent = request.agent(app);
    const loginResponse = await agent
      .post("/api/users/login")
      .send({ email: "admin@email.com", password: "123456" });

    console.log("loginResponse.status", loginResponse.status);
    console.log("loginResponse.body", loginResponse.body);

    // Assuming the token is returned in the body of the response
    const match = loginResponse.headers["set-cookie"][0].match(/jwt=([^;]+)/);

    const jwt = match[1];
    console.log(jwt);
    token = jwt;
    expect(loginResponse.status).toBe(200);
  });

  it("deletes a product when admin is logged in", async () => {
    const id = 7;
    const response = await agent
      .delete(`/api/products/${id}`)
      .set("Cookie", `jwt=${token}`); // Set the jwt as a cookie

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Product removed" });
  });
});
