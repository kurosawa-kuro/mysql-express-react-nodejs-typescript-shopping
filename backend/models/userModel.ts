// backend\models\userModel.ts

import { db } from "../database/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export const createUserInDB = async (data: Prisma.UserCreateInput) => {
  return await db.user.create({ data });
};

export const readUserByEmailInDB = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const readAllUsersFromDB = async () => {
  return await db.user.findMany();
};

export const readUserByIdInDB = async (id: number) => {
  return await db.user.findUnique({ where: { id } });
};

export const updateUserByIdInDB = async (id: number, data: any) => {
  return await db.user.update({ where: { id }, data });
};

export const deleteUserByIdInDB = async (id: number) => {
  return await db.user.delete({ where: { id } });
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
