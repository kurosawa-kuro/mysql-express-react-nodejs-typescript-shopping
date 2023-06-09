// backend/middleware/errorMiddleware.ts

// External Imports
import { Request, Response, NextFunction } from "express";

// Not Found Middleware
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler Middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // If Prisma not found error, set to 404 and change message
  const message = err.code === "P2025" ? "Resource not found" : err.message;

  if (err.code === "P2025") {
    res.status(404);
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
