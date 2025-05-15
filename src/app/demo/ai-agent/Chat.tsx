"use client";

import { CardContent } from "@/components/ui/card";
import { type Context, ContextSchema } from "@/lib/ai-agent/types/context";
import fetchEventSource from "@/lib/fetch-event-source";
import { throttle } from "radashi";
import { useEffect, useMemo, useRef } from "react";
import { useImmer } from "use-immer";
import { Dialog } from "./Dialog";
import { ComponentProvider } from "./Provider";
import { Think } from "./Think";
import { UserInput } from "./UserInput";

const localStorageKey = "demo-langchain-chat-context-v1";
export default function Chat() {
  const refDialog = useRef<HTMLDivElement>(null);
  const refThink = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useImmer<{
    busy: boolean;
    debug: boolean;
    context: Context;
  }>({
    busy: false,
    debug: false,
    context: ContextSchema.parse({}),
  });
  useEffect(() => {
    const contextStr = localStorage.getItem(localStorageKey);
    if (contextStr) {
      const result = ContextSchema.safeParse(JSON.parse(contextStr));
      if (result.success) {
        setState((d) => {
          d.context = result.data;
        });
      }
    }
  }, [setState]);
  const handleSubmit = async () => {
    if (state.busy) return;
    const userInput = refInput.current!.value;
    refInput.current!.value = "";
    setState((d) => {
      d.busy = true;
    });
    try {
      await fetchEventSource("/api/ai/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, context: state.context }),
        onmessage(ev) {
          const data = ev.data;
          const results = ContextSchema.safeParse(data);
          if (results.success) {
            localStorage.setItem(localStorageKey, JSON.stringify(results.data));
            setState((draft) => {
              draft.context = results.data;
            });
          }
        },
        onclose() {
          console.log("onclose");
        },
        onerror(error) {
          console.error(error);
        },
        openWhenHidden: true,
      });
      setState((draft) => {
        draft.busy = false;
      });
    } catch (_error) {
      setState((draft) => {
        draft.context = ContextSchema.parse({});
        draft.busy = false;
      });
    }
  };
  const handleSuggestInput = (input: string) => {
    refInput.current!.value = input;
    handleSubmit();
  };
  const handleNewTopic = () => {
    setState((draft) => {
      draft.context = ContextSchema.parse({});
    });
    refInput.current!.value = "";
    localStorage.removeItem(localStorageKey);
  };
  const toggleDebug = () => {
    setState((draft) => {
      draft.debug = !draft.debug;
    });
  };

  const scrollToBottom = useMemo(() => {
    const cb = () => {
      if (refDialog.current) {
        refDialog.current.scrollTo({
          top: refDialog.current.scrollHeight,
          behavior: "smooth",
        });
      }
      if (refThink.current) {
        refThink.current.scrollTo({
          top: refThink.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };
    return throttle(
      {
        interval: 1000,
        trailing: true,
      },
      cb,
    );
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [state.context]);
  return (
    <ComponentProvider
      value={{
        busy: state.busy,
        debug: state.debug,
        chatContext: state.context,
        refInput,
        refThink,
        refDialog,
        handleSubmit,
        handleSuggestInput,
        handleNewTopic,
        toggleDebug,
      }}
    >
      <CardContent className="h-[680px] p-0 flex flex-row overflow-auto items-stretch [&>*]:animate-in [&>*]:fade-in [&>*]:duration-1000">
        {state.debug ? <Think /> : null}
        <div className="w-[640px] overflow-auto flex flex-col border-r border-transparent">
          <Dialog />
          <UserInput />
        </div>
      </CardContent>
    </ComponentProvider>
  );
}
