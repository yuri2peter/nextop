import * as cheerio from "cheerio";
import { fixRelativeLinks } from "../string";
import { scrapeHtml } from "../utils.server";
import { parseLinks } from "./parseLinks";
import { parseManifest } from "./parseManifest";
import { getBaseUrl, getManifestUrl } from "./utils";

export default async function parseFavicon(url: string) {
  const html = await scrapeHtml(url);
  const dom = cheerio.load(html);
  const baseUrl = getBaseUrl(dom, url);
  const linkIcons = parseLinks(dom);
  const manifestUrl = fixRelativeLinks(
    getManifestUrl(dom) ?? "/manifest.json",
    baseUrl,
  );
  const manifestIcons = await parseManifest(manifestUrl);
  const icons = [...linkIcons, ...manifestIcons].map((t) => ({
    ...t,
    src: fixRelativeLinks(t.src, baseUrl),
  }));
  return icons;
}
