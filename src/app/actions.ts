"use server";

import { callLlm } from "@/lib/llm/llm";
import { updateSession } from "@/lib/session.server";
import { revalidatePath } from "next/cache";
export default async function revalidatePathClient(path = "/") {
  revalidatePath(path);
}

export async function updateSessionClient() {
  await updateSession();
  return {
    success: true,
  };
}

export async function callLlmClient(prompt: string) {
  const result = await callLlm({
    dialog: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return {
    result,
  };
}
