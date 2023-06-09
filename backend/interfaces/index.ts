// backend\interfaces\index.ts

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User as UserType } from "@prisma/client";

export interface DecodedJwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export interface UserWithoutPassword extends Omit<UserType, "password"> {}

// export type RequestUser = Request & { user?: UserWithoutPassword };
export type RequestUser = Request & { user?: UserWithoutPassword };

export interface OrderItems {
  id: number;
  qty: number;
}
