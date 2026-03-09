import { Router } from "express";
import { AppError } from "../errors/AppError";

export const testRouter = Router();

testRouter.get("/test/throw", (_req, _res) => {
  throw new Error("boom");
});

testRouter.get("/test/bad-request", (_req, _res, next) => {
  next(new AppError(400, "Bad Request"));
});
