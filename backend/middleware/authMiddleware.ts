// backend/middleware/authMiddleware.ts

// External Imports
import { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Internal Imports
import { db } from "../database/prisma/prismaClient";
import { User as UserType } from "@prisma/client";

interface DecodedData extends JwtPayload {
  userId: string;
}

// Omit 'id' and 'password' from UserType as we are going to use a string id instead
export interface ReqUser extends Request {
  user: Omit<UserType, "id" | "password"> & { id: string };
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const jwtSecret: Secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, jwtSecret) as DecodedData;

      const user = await db.user.findUnique({
        where: { id: Number(decoded.userId) },
      });

      if (user) {
        // Here we are destructuring user to remove 'id' and 'password'
        const { id, password, ...userWithoutPassword } = user;
        // Then we construct req.user with our new 'id' of string type and the rest of the user data
        (req as ReqUser).user = {
          ...userWithoutPassword,
          id: decoded.userId,
        };
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export const admin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as ReqUser).user && (req as ReqUser).user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  }
);
