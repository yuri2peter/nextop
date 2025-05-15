import { env } from "@/lib/env.server";
import { ChatOpenAI } from "@langchain/openai";
import { random } from "radashi";
import type { LlmDialog } from "./types";
export async function callLlm({
  dialog,
  onStream = () => {},
}: {
  dialog: LlmDialog;
  onStream?: (content: string) => void | Promise<void>;
}) {
  const model = new ChatOpenAI({
    model: env.OPENAI_MODEL,
    apiKey: env.OPENAI_API_KEY,
    modelKwargs: {
      seed: random(0, 1000000),
      private: true,
    },
    configuration: {
      baseURL: env.OPENAI_BASEURL,
    },
    maxRetries: 0,
  });
  const r = await model.stream(dialog, {});
  let content = "";
  for await (const chunk of r) {
    content += chunk.content;
    await onStream(content);
  }
  return content;
}
