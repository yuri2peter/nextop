import { Button } from "@/components/ui/button";
import { useComponentContext } from "./Provider";

export function InputSuggestions() {
  const { chatContext: c, handleSuggestInput } = useComponentContext();
  return (
    <div className="p-0">
      {c.extra.state === "idle" ? (
        <div className="flex flex-col gap-4">
          {c.extra.suggested_inputs.map((input) => (
            <Button
              key={input}
              variant="outline"
              size="sm"
              className="w-full whitespace-normal h-fit p-2"
              onClick={() => handleSuggestInput(input)}
            >
              {input}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
