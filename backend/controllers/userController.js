// backend\controllers\userController.js

import bcrypt from "bcryptjs";
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import { db } from "../database/prisma/prismaClient.js";

const removePasswordFromUserObject = (user) => {
  let userWithoutPassword = Object.assign({}, user);
  delete userWithoutPassword.password;
  return userWithoutPassword;
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user.id);
    res.json(removePasswordFromUserObject(user));
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await db.user.findUnique({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      isAdmin: false
    },
  });

  if (user) {
    generateToken(res, user.id);
    res.status(201).json(removePasswordFromUserObject(user));
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = asyncHandler(async (req, res) => {
  const id = Number(req.user.id);
  const user = await db.user.findUnique({ where: { id } });

  if (user) {
    res.json(removePasswordFromUserObject(user));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const id = Number(req.user.id);
  const user = await db.user.findUnique({ where: { id } });

  if (user) {
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        password: req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password
      },
    });

    res.json(removePasswordFromUserObject(updatedUser));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await db.user.findUnique({ where: { id } });

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }

    await db.user.delete({ where: { id } });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await db.user.findUnique({ where: { id } });

  if (user) {
    res.json(removePasswordFromUserObject(user));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await db.user.findUnique({ where: { id } });

  if (user) {
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        isAdmin: Boolean(req.body.isAdmin),
      },
    });

    res.json({
      id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
