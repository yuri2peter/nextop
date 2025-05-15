import MarkdownPreview from "@/integrations/markdown/MarkdownPreview";
import { useComponentContext } from "./Provider";

export function Think() {
  const { chatContext: c, refThink } = useComponentContext();
  return (
    <div
      className="block p-4 shadow-none w-[300px] shrink-0 overflow-auto border-r border-border"
      ref={refThink}
    >
      <MarkdownPreview
        text={[c.memory.long_term, c.memory.short_term].join("\n\n")}
        className={"[&>*]:animate-in [&>*]:fade-in [&>*]:duration-1000"}
      />
    </div>
  );
}
