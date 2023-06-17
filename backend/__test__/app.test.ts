// backend\test\app.test.ts

import request from "supertest";
import { app } from "../index";

describe("GET /", () => {
  it("responds with a json message", async () => {
    const response: request.Response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toEqual("API is running....");
  });
});
