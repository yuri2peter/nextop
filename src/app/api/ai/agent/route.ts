import { AiAgent } from "@/lib/ai-agent/AiAgent";
import { ContextManager } from "@/lib/ai-agent/ContextManager";
import { imageGenerationTool } from "@/lib/ai-agent/tools/image_generation";
import { imageSearchTool } from "@/lib/ai-agent/tools/image_search";
import { randomNumbersTool } from "@/lib/ai-agent/tools/random_numbers";
import { webExtractTool } from "@/lib/ai-agent/tools/web_extract";
import { webSearchTool } from "@/lib/ai-agent/tools/web_search";
import { type Context, ContextSchema } from "@/lib/ai-agent/types/context";
import type { Tool } from "@/lib/ai-agent/types/tool";
import { generateSseResponse } from "@/lib/utils.server";
import fs from "fs-extra";
import { throttle } from "radashi";
import { z } from "zod";

export async function POST(request: Request) {
  const id = new Date().getTime();
  const logFile = `./runtime/logs/ai-agent/${id}.json`;
  await fs.ensureFile(logFile);
  const logContext = throttle(
    {
      interval: 1000,
      trailing: true,
    },
    (context: Context) => {
      fs.writeFile(logFile, JSON.stringify(context, null, 2));
    },
  );
  const { userInput, context } = z
    .object({
      userInput: z.string(),
      context: ContextSchema,
    })
    .parse(await request.json());
  return generateSseResponse(async (textWriter) => {
    const tools = [
      webSearchTool,
      imageGenerationTool,
      webExtractTool,
      randomNumbersTool,
      imageSearchTool,
    ] as unknown as Tool[];
    const contextManager = new ContextManager(context, (context) => {
      textWriter(JSON.stringify(context));
      logContext(context);
    });
    const aiAgent = new AiAgent({
      userInput: userInput,
      contextManager,
      tools,
    });
    await aiAgent.process();
  });
}
