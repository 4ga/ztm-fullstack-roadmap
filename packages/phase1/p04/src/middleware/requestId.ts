import { Request, Response, NextFunction } from "express";

export type CreateRequestId = () => string;

export function createRequestIdMiddleware(createRequestId: CreateRequestId) {
  return function requestIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const headerValue = req.header("x-request-id");
    const requestId = headerValue || createRequestId();

    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);

    next();
  };
}
