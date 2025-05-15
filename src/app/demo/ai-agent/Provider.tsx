import type { Context as ChatContext } from "@/lib/ai-agent/types/context";
import { createContext, useContext } from "react";

export type ContextValue = {
  busy: boolean;
  debug: boolean;
  chatContext: ChatContext;
  refInput: React.RefObject<HTMLTextAreaElement | null>;
  refThink: React.RefObject<HTMLDivElement | null>;
  refDialog: React.RefObject<HTMLDivElement | null>;
  handleSubmit: () => void;
  handleSuggestInput: (input: string) => void;
  handleNewTopic: () => void;
  toggleDebug: () => void;
};

export const Context = createContext<ContextValue>({} as ContextValue);

export const ComponentProvider = Context.Provider;

export function useComponentContext() {
  return useContext(Context);
}
