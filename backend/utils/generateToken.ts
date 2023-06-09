// utils/generateToken.js

// External Imports
import { Response } from "express";
import jwt from "jsonwebtoken";

// Internal Imports
import { User as UserType } from "@prisma/client";

const generateToken = (res: Response, userId: UserType["id"]): void => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "30d" });

  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
