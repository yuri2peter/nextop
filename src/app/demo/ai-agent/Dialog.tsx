import { Card, CardContent } from "@/components/ui/card";
import MarkdownPreview from "@/integrations/markdown/MarkdownPreview";
import { cn } from "@/lib/utils";
import { InputSuggestions } from "./InputSuggestions";
import { useComponentContext } from "./Provider";

export function Dialog() {
  const { debug, refDialog, chatContext: c } = useComponentContext();
  return (
    <div ref={refDialog} className="p-4 space-y-4 overflow-auto flex-1">
      {c.dialog.map((m) => {
        if (!debug && !["user", "assistant"].includes(m.role)) {
          return null;
        }
        return (
          <Card className={cn("p-4", { invert: m.role === "user" })} key={m.id}>
            <CardContent>
              <MarkdownPreview
                text={[
                  m.content,
                  m.data
                    ? `\`\`\`json\n${JSON.stringify(m.data, null, 2)}\n\`\`\``
                    : "",
                ].join("\n")}
              />
            </CardContent>
          </Card>
        );
      })}
      <InputSuggestions />
    </div>
  );
}
