import { env } from "@/lib/env.server";
import type { Tool } from "../types/tool";
import { imageGenerationTool } from "./image_generation";
import { imageSearchTool } from "./image_search";
import { llmTool } from "./llm";
import { memoTool } from "./memo";
import { randomNumbersTool } from "./random_numbers";
import { webExtractTool } from "./web_extract";
import { webSearchTool } from "./web_search";

export const defaultTools = [
  env().TAVILY_API_KEY ? webSearchTool : null,
  imageGenerationTool,
  webExtractTool,
  randomNumbersTool,
  env().PEXELS_API_KEY ? imageSearchTool : null,
  memoTool,
  llmTool,
].filter(Boolean) as unknown as Tool[];
