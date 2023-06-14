// External Imports
import { Secret } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import {
  DecodedJwtPayloadWithUserId,
  RequestUser,
  UserWithoutPassword,
} from "../interfaces/index";

export const protect = asyncHandler(
  async (req: RequestUser, res: Response, next: NextFunction) => {
    console.log("req.cookies.jwt", req.cookies.jwt);
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const jwtSecret: Secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(
        token,
        jwtSecret
      ) as DecodedJwtPayloadWithUserId;

      const id = Number(decoded.userId);
      const user = await db.user.findUnique({
        where: { id },
      });
      console.log({ user });

      if (user) {
        // Here we are destructuring user to remove 'password'
        const { password, ...userWithoutPassword } = user;
        // Then we construct req.user with the remaining user data
        req.user = {
          ...userWithoutPassword,
          id: Number(decoded.userId),
        } as UserWithoutPassword;
        console.log({ req_user: req.user });
      }

      next();
    } catch (error: any) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export const admin = asyncHandler(
  async (req: RequestUser, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  }
);
