import * as cheerio from "cheerio";
import { Queue } from "./queue";
import { fixRelativeLinks } from "./string";

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(error: unknown, status = 500) {
  let message = String(error);
  if (error instanceof Error) {
    message = error.message;
  }
  return jsonResponse({ error: message }, status);
}

// SSE response, used for streaming text
// For the client, use "@/lib/fetch-event-source" to receive the stream
export function generateSseResponse(
  task: (textWriter: (text: string) => void) => Promise<void>,
) {
  const outputStream = new TransformStream();
  const writer = outputStream.writable.getWriter();
  const writeQueue = new Queue();
  const writeTextPlain = async (text: string) => {
    try {
      await writer.ready;
      const encoder = new TextEncoder();
      const data = `data: ${text}\n\n`;
      await writer.write(encoder.encode(data));
    } catch (error) {
      console.error("Error writing text:", error);
    }
  };
  const writeText = (text: string) => {
    writeQueue.add(writeTextPlain(text));
  };
  // Create a response immediately with the readable stream
  const response = new Response(outputStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  // Handle the task and writer closure in the background
  (async () => {
    try {
      await task(writeText);
    } catch (error) {
      console.error("Stream task error:", error);
    }
    await writeQueue.allCleared();
    writer.close();
  })();

  return response;
}

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

export async function scrapeHtml(
  url: string,
  {
    userAgent = DEFAULT_USER_AGENT,
    transRelativeLinks = true,
    removeScriptsAndStyles = true,
  }: {
    userAgent?: string;
    transRelativeLinks?: boolean;
    removeScriptsAndStyles?: boolean;
  } = {},
) {
  let html = `<html><head><title>Error</title></head><body><p>${url} is not available.</p></body></html>`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
      },
    });
    html = await res.text();
  } catch (_error) {}
  const dom = cheerio.load(html);
  const baseUrl = (() => {
    const baseUrl = dom("base").attr("href");
    if (baseUrl) {
      return new URL(baseUrl, url).href;
    }
    return url;
  })();
  if (removeScriptsAndStyles) {
    dom("script, style, noscript").remove();
  }
  if (transRelativeLinks) {
    dom("meta, a, link").each((_index, item) => {
      const href = dom(item).attr("href");
      if (href) {
        dom(item).attr("href", fixRelativeLinks(href, baseUrl));
      }
    });
    dom("img").each((_index, item) => {
      const src = dom(item).attr("src");
      if (src) {
        dom(item).attr("src", fixRelativeLinks(src, baseUrl));
      }
    });
  }
  html = dom.html();
  return html;
}
