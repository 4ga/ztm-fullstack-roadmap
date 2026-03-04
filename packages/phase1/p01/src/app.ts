import express, { type Request, type Response } from "express";

export const app = express();

// GET /health -> 200 {"status": "ok"}
app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
});

// 404 handler for unknown routes -> 404 {"error": "Not Found"}
app.use((req: Request, res: Response) => {
  return res.status(404).json({ "error": "Not Found" });
});
