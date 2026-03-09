import { z } from "zod";

export const echoBodySchema = z.object({
  message: z.string().min(1),
});


