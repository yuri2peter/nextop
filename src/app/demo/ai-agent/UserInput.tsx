import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useComponentContext } from "./Provider";

export function UserInput() {
  const {
    chatContext: c,
    refInput,
    busy,
    handleSubmit,
    handleNewTopic,
    debug,
    toggleDebug,
  } = useComponentContext();
  const stateLabel = (() => {
    switch (c.extra.state) {
      case "thinking":
        return "AI is thinking...";
      case "outputting":
        return "AI is outputting...";
      case "executing":
        return c.extra.task_summary;
      case "error":
        return "Error";
      default:
        return "Press Enter to send";
    }
  })();
  return (
    <div className="shrink-0 h-[140px] flex flex-col border-t border-border">
      <Textarea
        ref={refInput}
        style={{
          backgroundColor: "transparent",
        }}
        className="resize-none flex-1 border-none shadow-none focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="flex justify-between items-center p-4 shrink-0">
        <p
          className={cn("text-sm text-muted-foreground", {
            "animate-pulse": c.extra.state !== "idle",
          })}
        >
          {stateLabel}
        </p>
        <div className="flex gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="switch_debug"
              checked={debug}
              onCheckedChange={toggleDebug}
            />
            <Label htmlFor="switch_debug">Debug</Label>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={handleNewTopic}
          >
            New Topic
          </Button>
          <Button size="sm" disabled={busy} onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
