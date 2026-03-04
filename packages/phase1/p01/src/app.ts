import express, { type Request, type Response } from "express";

export const app = express();
app.disable("x-powered-by");

// GET /health -> 200 {"status": "ok"}
app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
});

// 404 handler for unknown routes -> 404 {"error": "Not Found"}
app.use((_req: Request, res: Response) => {
  return res.status(404).json({ error: "Not Found" });
});
