import { parseMarkdown } from "@/app/demo/web-parser/parsers/parseMarkdown";
import { env } from "@/lib/env.server";
import { scrapeHtml } from "@/lib/utils.server";
import { tavily } from "@tavily/core";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  urls: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Urls to extract information from."),
});

export const webExtractTool: Tool<typeof schema> = {
  name: "web_extract",
  description:
    "Extract information from specific URLs and return the detailed content of each page as a list of objects.",
  schema,
  execute: async (input) => {
    const { urls } = input;
    const results = await extractWithNativeParser(urls);
    return results;
  },
};

async function extractWithNativeParser(urls: string[]) {
  const results = await Promise.all(
    urls.map(async (url) => {
      const html = await scrapeHtml(url);
      const content = parseMarkdown(html);
      return {
        url,
        content,
      };
    }),
  );
  return results;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
async function extractWithTavily(urls: string[]) {
  const client = tavily({ apiKey: env.TAVILY_API_KEY });
  const results = await client.extract(urls, {
    extractDepth: "basic",
    includeImages: true,
  });
  return results;
}
