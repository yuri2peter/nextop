import EditorCrepe from "@/integrations/markdown/EditorCrepe";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  return <EditorCrepe defaultValue={example} />;
}
