import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  ENABLE_DEMO: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  SESSION_SECRET: z.string().min(8).default("CHANGE_ME"),
  LLM_INPUT_TOKEN_LIMIT: z
    .string()
    .default("20000")
    .transform((val) => Number(val)),
  OPENAI_API_KEY: z.string().min(0).default("NOT_SET"),
  OPENAI_BASEURL: z
    .string()
    .min(0)
    .default("https://text.pollinations.ai/openai"),
  OPENAI_MODEL: z.string().min(0).default(""),
  TAVILY_API_KEY: z.string().min(0).default(""),
  PEXELS_API_KEY: z.string().min(0).default(""),
});

export const env = () => EnvSchema.parse(process.env);
