import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error({
      name: err?.name,
      message: err?.message,
      method: req.method,
      path: req.path,
      requestId: res.getHeader("x-request-id") ?? req.headers["x-request-id"],
    });
  }
  res.status(statusCode).json({ error: message });
};
