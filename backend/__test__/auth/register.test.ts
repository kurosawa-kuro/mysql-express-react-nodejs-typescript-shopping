// backend\__test__\auth\register.test.ts

import request, { SuperAgentTest } from "supertest";
import { app } from "../../index";
import { clearDatabase, createUserInDB } from "../test-utils";

describe("POST /api/users/register", () => {
  let agent: SuperAgentTest;

  beforeEach(async () => {
    await clearDatabase();
    agent = request.agent(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("registers a new user", async () => {
    const registerResponse = await agent
      .post("/api/users/register")
      .send({ name: "john", email: "john@email.com", password: "123456" });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty("id");
    expect(registerResponse.body.email).toEqual("john@email.com");
  });

  it("rejects registration with existing email", async () => {
    await createUserInDB("john@email.com", "123456");

    const registerResponse = await agent
      .post("/api/users/register")
      .send({ name: "john", email: "john@email.com", password: "123456" });

    expect(registerResponse.status).toBe(400);
  });

  it("rejects registration with invalid user data", async () => {
    const registerResponse = await agent
      .post("/api/users/register")
      .send({ name: "john", email: "john@email.com" }); // password is missing

    expect(registerResponse.status).toBe(400);
  });
});
