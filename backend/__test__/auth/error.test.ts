// backend\__test__\auth\error.test.ts

// External Imports
import request from "supertest";
import express, { Express } from "express";
import cookieParser from "cookie-parser";

// Internal Imports
import { protect, admin } from "../../middleware/authMiddleware";
import { errorHandler } from "../../middleware/errorMiddleware";

let server: Express;

beforeAll(() => {
  server = express();
  server.use(cookieParser());
  server.use("/protected", protect, (req, res, next) => res.sendStatus(200));
  server.use("/admin", admin, (req, res, next) => res.sendStatus(200));
  server.use(errorHandler);
});

describe("Auth Middleware", () => {
  it("should return 401 error if no token is provided", async () => {
    const res = await request(server).get("/protected");

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Not authorized, no token");
  });

  it("should return 401 error if the token is invalid", async () => {
    const res = await request(server)
      .get("/protected")
      .set("Cookie", ["jwt=invalidtoken"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Not authorized, token failed");
  });
});

describe("Admin Middleware", () => {
  it("should return 401 error if no token is provided", async () => {
    const res = await request(server).get("/admin");

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Not authorized as an admin");
  });

  it("should return 401 error if the token is invalid", async () => {
    const res = await request(server)
      .get("/admin")
      .set("Cookie", ["jwt=invalidtoken"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Not authorized as an admin");
  });
});
