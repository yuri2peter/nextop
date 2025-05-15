import * as cheerio from "cheerio";

export async function parseBasics(html: string) {
  const dom = cheerio.load(html);
  const title = dom("title").text();
  const description = dom('meta[name="description"]').attr("content") ?? "";
  const bodyHtml = dom("body").html() ?? "";
  const bodyText = (dom("body").text() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  return { title, description, bodyHtml, bodyText };
}
