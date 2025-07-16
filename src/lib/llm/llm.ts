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
  const apiKey = env().OPENAI_API_KEY;
  const baseURL = env().OPENAI_BASEURL;
  const model = env().OPENAI_MODEL;

  if (!apiKey || !baseURL || !model) {
    throw new Error("Missing OpenAI API key or base URL or model");
  }
  const client = new OpenAI({
    apiKey,
    baseURL,
  });
  const extraOptionsForPollinations = {
    seed: random(1, 1000000),
    private: true,
    // biome-ignore lint/complexity/noBannedTypes: unexpected options
  } as {};
  const response = await client.chat.completions.create(
    {
      model,
      messages: dialog,
      stream: true,
      ...extraOptionsForPollinations,
    },
    apiKey
      ? {}
      : {
          headers: {
            Authorization: "", // Pollinations will throw an error for "Bearer "
          },
        },
  );
  let content = "";
  for await (const chunk of response) {
    content += chunk.choices[0]?.delta.content ?? "";
    await onStream(content);
  }
  return content;
}
