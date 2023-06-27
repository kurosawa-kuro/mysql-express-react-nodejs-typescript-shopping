// backend\models\userModel.ts

import { db } from "../database/prisma/prismaClient";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number) => {
  return await db.user.findUnique({ where: { id } });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await db.user.create({
    data: {
      name,
      email,
      password,
      isAdmin: false,
    },
  });
};

export const updateUserById = async (id: number, data: any) => {
  return await db.user.update({ where: { id }, data });
};

export const findAllUsers = async () => {
  return await db.user.findMany();
};

export const deleteUserById = async (id: number) => {
  return await db.user.delete({ where: { id } });
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
