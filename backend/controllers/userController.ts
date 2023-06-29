// backend\controllers\userController.ts

// External Imports
import { Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Imports
import { generateToken, hashPassword } from "../utils";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  findAllUsers,
  deleteUserById,
  comparePassword,
} from "../models/userModel";
import { UserRequest, UserBase, UserData } from "../interfaces";

const sanitizeUser = (user: any): UserBase => {
  const { password, ...UserBase } = user;
  return UserBase;
};

const loginUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (user && (await comparePassword(password, user.password))) {
    generateToken(res, user.id);
    res.json(sanitizeUser(user));
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!password || !name || !email) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const userExists = await findUserByEmail(email);

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
  const createdUser = await createUser(user);

  if (createdUser) {
    generateToken(res, createdUser.id);
    res.status(201).json(sanitizeUser(createdUser));
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const logoutUser = (req: UserRequest, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = asyncHandler(async (req: UserRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const id = req.user.id;
  const user = await findUserById(id);

  if (user) {
    res.json(sanitizeUser(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const id = req.user.id;
    const user = await findUserById(id);

    if (user) {
      const updatedUser = await updateUserById(id, {
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

const getUsers = asyncHandler(async (req: UserRequest, res: Response) => {
  const users = await findAllUsers();
  res.json(users.map((user) => sanitizeUser(user)));
});

const deleteUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }

    await deleteUserById(id);
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (user) {
    res.json(sanitizeUser(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (user) {
    const updatedUser = await updateUserById(id, {
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
