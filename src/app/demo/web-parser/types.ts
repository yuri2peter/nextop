import { z } from "zod";

export const InputParamsSchema = z.object({
  url: z.string().url(),
});

export type InputParams = z.infer<typeof InputParamsSchema>;
