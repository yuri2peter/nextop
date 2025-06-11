import { env } from "@/lib/env.server";
import OpenAI from "openai";
import { random } from "radashi";
import type { LlmDialog } from "./types";

export async function callLlm({
  dialog,
  onStream = () => {},
}: {
  dialog: LlmDialog;
  onStream?: (content: string) => void | Promise<void>;
}) {
  const client = new OpenAI({
    apiKey: env().OPENAI_API_KEY,
    baseURL: env().OPENAI_BASEURL,
  });
  const extraOptionsForPollinations = {
    seed: random(1, 1000000),
    private: true,
    // biome-ignore lint/complexity/noBannedTypes: unexpected options
  } as {};
  const response = await client.chat.completions.create({
    model: env().OPENAI_MODEL,
    messages: dialog,
    stream: true,
    ...extraOptionsForPollinations,
  });
  let content = "";
  for await (const chunk of response) {
    content += chunk.choices[0]?.delta.content ?? "";
    await onStream(content);
  }
  return content;
}
