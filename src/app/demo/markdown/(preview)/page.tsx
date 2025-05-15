import MarkdownPreview from "@/integrations/markdown/MarkdownPreview";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  return <MarkdownPreview text={example} />;
}
