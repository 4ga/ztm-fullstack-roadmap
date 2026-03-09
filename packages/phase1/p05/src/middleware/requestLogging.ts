import { Request, Response, NextFunction } from "express";
import type { Logger } from "../lib/logger";

export function createRequestLoggingMiddleware(logger: Logger) {
  return function requestLoggingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const startedAt = Date.now();

    res.on("finish", () => {
      logger.info({
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });
    next();
  };
}
