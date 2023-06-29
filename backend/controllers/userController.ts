// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
import { generateToken, hashPassword } from "../utils";
import {
  createUserInDB,
  readAllUsersFromDB,
  readUserByEmailInDB,
  readUserByIdInDB,
  updateUserByIdInDB,
  deleteUserByIdInDB,
  comparePassword,
} from "../models/userModel";
import { UserRequest, UserInfo, UserData } from "../interfaces";

const sanitizeUser = (user: any): UserInfo => {
  const { password, ...UserBase } = user;
  return UserBase;
};

// CREATE
const registerUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!password || !name || !email) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const userExists = await readUserByEmailInDB(email);

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user: UserData = {
    name,
    email,
    password: hashedPassword,
  };
  const createdUser = await createUserInDB(user);

  if (createdUser) {
    generateToken(res, createdUser.id);
    res.status(201).json(sanitizeUser(createdUser));
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// READ
const loginUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const { email, password } = req.body;
  const user = await readUserByEmailInDB(email);

  if (user && (await comparePassword(password, user.password))) {
    generateToken(res, user.id);
    res.json(sanitizeUser(user));
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const readUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const id = req.user.id;
    const user = await readUserByIdInDB(id);

    if (user) {
      res.json(sanitizeUser(user));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

const readAllUsers = asyncHandler(async (req: UserRequest, res: Response) => {
  const users = await readAllUsersFromDB();
  res.json(users.map((user) => sanitizeUser(user)));
});

const readUserById = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await readUserByIdInDB(id);

  if (user) {
    res.json(sanitizeUser(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// UPDATE
const updateUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const id = req.user.id;
    const user = await readUserByIdInDB(id);

    if (user) {
      const updatedUser = await updateUserByIdInDB(id, {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        password: req.body.password
          ? await hashPassword(req.body.password)
          : user.password,
      });

      res.json(sanitizeUser(updatedUser));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

const updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await readUserByIdInDB(id);

  if (user) {
    const updatedUser = await updateUserByIdInDB(id, {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      isAdmin: Boolean(req.body.isAdmin),
    });

    res.json(sanitizeUser(updatedUser));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// DELETE
const logoutUser = (req: UserRequest, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const deleteUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await readUserByIdInDB(id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }

    await deleteUserByIdInDB(id);
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  loginUser,
  readUserProfile,
  readAllUsers,
  readUserById,
  updateUserProfile,
  updateUser,
  logoutUser,
  deleteUser,
};
