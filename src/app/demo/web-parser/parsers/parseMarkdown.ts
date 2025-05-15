import * as turndownPluginGfm from "joplin-turndown-plugin-gfm";
import TurndownService from "turndown";

export function parseMarkdown(html: string) {
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
    headingStyle: "atx",
    bulletListMarker: "-",
  });

  turndownService.use(turndownPluginGfm.gfm);

  turndownService.addRule("ignoreScriptsAndStyles", {
    filter: ["script", "style", "noscript"],
    replacement: () => "",
  });

  turndownService.keep([
    "h1",
    "h2",
    "h3",
    "p",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "blockquote",
    "pre",
    "code",
  ]);

  let markdown = turndownService.turndown(html);
  markdown = markdown.replace(/({|})/g, "\\$1");
  markdown = markdown.replace(/\[Skip to Content\]\(#[^\)]*\)/gi, "");

  return markdown;
}
