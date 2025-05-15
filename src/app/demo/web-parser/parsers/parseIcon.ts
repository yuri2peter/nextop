import parseFavicon from "@/lib/parse-favicon";

export async function parseIcon(_url: string) {
  const favicon = await parseFavicon(_url);
  return favicon;
}
