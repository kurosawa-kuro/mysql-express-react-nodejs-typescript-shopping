// backend\middleware\authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import { db } from '../database/prisma/prismaClient.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // console.log('authMiddleware.js protect() req.cookies:', req.cookies);
  // console.log('authMiddleware.js protect() req.cookies.jwt:', req.cookies.jwt);

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database without their password
      const user = await db.user.findUnique({ where: { id: decoded.userId } });
      const { password, ...userWithoutPassword } = user;

      // Set the request user to the authenticated user
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
