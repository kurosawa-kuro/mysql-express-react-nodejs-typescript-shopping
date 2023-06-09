// backend\interfaces\index.ts

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType } from "@prisma/client";

export interface DecodedJwtPayload extends JwtPayload {
  userId: string;
}

export interface UserWithoutPassword extends Omit<UserType, "password"> {}

export type ReqUser = Request & { user?: UserWithoutPassword };

export type RequestWithUser = Request & { user: UserType };

export interface OrderItems {
  id: number;
  qty: number;
}
