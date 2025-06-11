import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  return <MarkdownPreview text={example} />;
}
