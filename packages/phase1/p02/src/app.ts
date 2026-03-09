import express from "express";
import { validateBody } from "./middleware/validateBody";
import { echoBodySchema } from "./schemas/echo";

const app = express();
app.use(express.json());

app.post("/echo", validateBody(echoBodySchema), (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export { app };
