import { buildApp } from "./app";
import { config } from "./config/config";

const app = buildApp();
app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}`),
);
