import EditorCrepe from "@/integrations/markdown/editor-crepe";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  return <EditorCrepe defaultValue={example} />;
}
