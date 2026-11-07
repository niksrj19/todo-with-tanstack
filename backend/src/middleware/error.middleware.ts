import {
  ErrorRequestHandler
} from "express";

import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {

  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues
    });

    return;
  }

  if (
    error instanceof Error &&
    error.message === "Task not found"
  ) {
    res.status(404).json({
      success: false,
      message: error.message
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};