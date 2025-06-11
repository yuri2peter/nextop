import { AiAgent } from "@/lib/ai-agent/ai-agent";
import { ContextManager } from "@/lib/ai-agent/context-manager";
import { defaultTools } from "@/lib/ai-agent/tools/default-tools";
import { type Context, ContextSchema } from "@/lib/ai-agent/types/context";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { generateSseResponse } from "@/lib/utils.server";
import fs from "fs-extra";
import type { NextRequest } from "next/server";
import { throttle } from "radashi";
import { z } from "zod";

export async function POST(request: NextRequest) {
  // request.signal.onabort = () => {  console.log("abort"); }; // Somehow this is not working
  const { id, context } = z
    .object({
      id: z.string().optional(),
      configs: z.object({
        type: z.string().default("default"),
      }),
      context: ContextSchema,
    })
    .parse(await request.json());

  try {
    const { markStart, markStop, refShouldAbort } =
      createAgentRequestController(id);
    return generateSseResponse(async (textWriter) => {
      await markStart();
      const logContext = await createContextLogWriter();
      const contextManager = new ContextManager(context, (context) => {
        textWriter(JSON.stringify(context));
        logContext(context);
        if (refShouldAbort.current) {
          aiAgent.abort();
        }
      });
      const aiAgent = new AiAgent({
        contextManager,
        tools: [...defaultTools],
      });
      await aiAgent.process();
      await markStop();
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = z.object({ id: z.string() }).parse(await request.json());
  await prisma.entry.deleteMany({
    where: { name: id, type: "temp" },
  });
  return new Response("OK");
}
async function createContextLogWriter() {
  const logFile = `./runtime/logs/ai-agent/${new Date().getTime()}.json`;
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
  return logContext;
}

function createAgentRequestController(requestId = shortId()) {
  let intervalId: NodeJS.Timeout;
  const refShouldAbort = { current: false };
  return {
    markStart: async () => {
      await prisma.entry.create({
        data: {
          name: requestId,
          type: "temp",
        },
      });
      intervalId = setInterval(async () => {
        const entry = await prisma.entry.findFirst({
          where: {
            name: requestId,
            type: "temp",
          },
        });
        if (!entry) {
          refShouldAbort.current = true;
          clearInterval(intervalId);
        }
      }, 1000);
    },
    markStop: async () => {
      clearInterval(intervalId);
      await prisma.entry.deleteMany({
        where: {
          name: requestId,
          type: "temp",
        },
      });
    },
    refShouldAbort,
  };
}
