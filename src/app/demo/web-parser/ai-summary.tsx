import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import aiDocWriting from "@/lib/ai-doc-writing";

export default async function AiSummary({
  doc,
}: {
  doc: string;
}) {
  const summary = await aiDocWriting({ doc });
  return <MarkdownPreview text={summary} />;
}
