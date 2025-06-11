import "@yuri2/codemirror-ai-enhancer/styles.css";
import fetchEventSource from "@/lib/fetch-event-source";
import type {
  EnhancerConfig,
  PromptParams,
  TextChangeHandler,
} from "@yuri2/codemirror-ai-enhancer";
import { toast } from "sonner";
import { z } from "zod";

function handleCompletion(prompt: string, onTextChange: TextChangeHandler) {
  fetchEventSource("/api/ai/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, stream: true }),
    onmessage: (event) => {
      onTextChange(z.object({ text: z.string() }).parse(event.data).text);
    },
  }).catch(() => {
    toast.error("Failed to connect to AI, please try again later.");
  });
}

function createInsertPrompt({ prefix, suffix, command }: PromptParams) {
  return `
You are an AI writing assistant. You should insert new content at <CURRENTCURSOR/> in the document (USERDOCUMENT) according to the USERCOMMAND.
Insert content at the cursor position only, do not change other text.

<USERDOCUMENT>${prefix}<CURRENTCURSOR/>${suffix}</USERDOCUMENT>

USERCOMMAND: ${command}

Output the inserted content only, do not explain.
`;
}

function createRewritePrompt({
  prefix,
  suffix,
  selection,
  command,
}: PromptParams) {
  return `
You are an AI writing assistant. You should rewrite the user selected content (USERSELECTION) in the document (USERDOCUMENT) according to the USERCOMMAND.
Rewrite selected text only, do not change other text.

<USERDOCUMENT>${prefix}<USERSELECTION>${selection}</USERSELECTION>${suffix}</USERDOCUMENT>

USERCOMMAND: ${command}

Output the rewritten content only, do not explain.
`;
}

function createAssistantPrompt({
  prefix,
  suffix,
  selection,
  command,
}: PromptParams) {
  return `
You are a helpful assistant. You should answer the user's question (USERQUESTION), use the USERDOCUMENT as context if needed.

<USERDOCUMENT>${prefix}<USERSELECTION>${selection}</USERSELECTION>${suffix}</USERDOCUMENT>

USERQUESTION: ${command}

Output the answer only.
`;
}

export const aiEnhancerConfig: EnhancerConfig = {
  insert: ({ onTextChange, ...promptParams }) =>
    handleCompletion(createInsertPrompt(promptParams), onTextChange),
  rewrite: ({ onTextChange, ...promptParams }) =>
    handleCompletion(createRewritePrompt(promptParams), onTextChange),
  assist: ({ onTextChange, ...promptParams }) =>
    handleCompletion(createAssistantPrompt(promptParams), onTextChange),
};
