import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type AppConfig = {
  nodeEnv: "development" | "test" | "production";
  port: number;
};

export function parseConfig(
  env: Record<string, string | undefined>,
): AppConfig {
  const parsed = envSchema.parse(env);

  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
  };
}

export const config = parseConfig(process.env);
