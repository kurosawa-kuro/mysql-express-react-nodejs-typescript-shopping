// backend\models\userModel.ts

import { db } from "../database/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { UserData } from "../interfaces/index";
import { Prisma } from "@prisma/client";

export const getUserByEmailFromDB = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const getUserByIdFromDB = async (id: number) => {
  return await db.user.findUnique({ where: { id } });
};

export const createUserInDB = async (data: Prisma.UserCreateInput) => {
  return await db.user.create({ data });
};

export const updateUserByIdInDB = async (id: number, data: any) => {
  return await db.user.update({ where: { id }, data });
};

export const getAllUsersFromDB = async () => {
  return await db.user.findMany();
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
