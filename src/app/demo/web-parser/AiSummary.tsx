import MarkdownPreview from "@/integrations/markdown/MarkdownPreview";
import { callLlm } from "@/lib/llm/llm";

export default async function AiSummary({
  markdown,
  title,
  description,
}: {
  markdown: string;
  title: string;
  description: string;
}) {
  const defaultMarkdown = [`# ${title}`, `**${description}**`, markdown].join(
    "\n\n",
  );
  const summary = await getSummary(defaultMarkdown);
  return <MarkdownPreview text={summary} />;
}

const prompt = (defaultMarkdown: string) => `
You are an AI writing assistant. You need to improve the following user's markdown document.

User's document is marked as <USERDOCUMENT>...</USERDOCUMENT>.

Follow these guidelines:

- **Title**: Ensure the title is succinct, containing only the article's name.
- **Length**: Keep content under 2500 characters.
- **Formatting**: Structure with Markdown headers, lists, and formatting to create a clear hierarchy.
- **Focus**: Summarize and condense to highlight main points.
- **Remove Unnecessary Sections**: Exclude sidebars, footers, recommendations, related posts, TOC and ads.
- **Images**: Retain relevant images within the body content, mark them with ![alt text](image_url).
- **Headings**: Starts with a H1 heading for the title. Start each heading and subheading with an appropriate emoji on the start if possible.
- **Lists**: Limit lists to a maximum of 10 items for readability. Bullet list should use * as the bullet point for the first level.

<USERDOCUMENT>${defaultMarkdown}</USERDOCUMENT>

Example output:

# Title

**Description...**

...
`;

async function getSummary(markdown: string) {
  const response = await callLlm({
    dialog: [{ role: "system", content: prompt(markdown) }],
  });
  return response;
}
