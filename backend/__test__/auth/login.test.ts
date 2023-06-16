// backend\__test__\auth\login.test.ts

import request from "supertest";
import { app } from "../../index";

describe("POST /api/login", () => {
  it("logs in a user with correct credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "john@email.com", password: "123456" });
    console.log(
      'response.headers["set-cookie"]: ',
      response.headers["set-cookie"]
    );
    console.log("response.body: ", response.body);
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("rejects login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "john@email.com", password: "wrong-password" });

    expect(response.status).toBe(401);
  });
});
