import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  return next(new AppError(404, "Not Found"));
};
