import express from "express";

const app = express();
app.use(express.json());

app.post("/echo", (req, res) => {
  res.status(200).json({ message: "hello" });
});

export { app };
