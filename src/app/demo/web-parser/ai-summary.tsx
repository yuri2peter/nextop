import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import aiDocSummary from "@/lib/ai-doc-summary";

export default async function AiSummary({
  doc,
}: {
  doc: string;
}) {
  const summary = await aiDocSummary({ doc });
  return <MarkdownPreview text={summary} />;
}
