// External Imports
import { Secret } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import {
  UserDecodedJwtPayload,
  UserRequest,
  UserInfo,
} from "../interfaces/index";

export const protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const jwtSecret: Secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, jwtSecret) as UserDecodedJwtPayload;

      const id = Number(decoded.userId);
      const user = await db.user.findUnique({
        where: { id },
      });

      if (user) {
        const { password, ...UserBase } = user;
        req.user = {
          ...UserBase,
          id,
        } as UserInfo;
      }

      next();
    } catch (error: any) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export const admin = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  }
);
