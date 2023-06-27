// backend\utils\index.ts

// External Imports
import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Internal Imports
import { User as UserType } from "@prisma/client";

export const generateToken = (res: Response, userId: UserType["id"]): void => {
  const { NODE_ENV, JWT_SECRET } = process.env;

  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
