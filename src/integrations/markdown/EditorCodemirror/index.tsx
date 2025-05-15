"use client";
import { aiEnhancer } from "@yuri2/codemirror-ai-enhancer";
import "@yuri2/codemirror-ai-enhancer/styles.css";
import { cn } from "@/lib/utils";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { debounce } from "radashi";
import { useMemo, useRef } from "react";
import { aiEnhancerConfig } from "./features/aiEnhancerConfig";
import styles from "./styles.module.css";

export default function EditorCodemirror({
  value,
  onChange,
  className,
  onChangeDebounceDelay = 0,
  enableAiEnhancer = false,
  language = "markdown",
  theme = "light",
}: {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  language?: Parameters<typeof loadLanguage>[0];
  theme?: "dark" | "light";
  onChangeDebounceDelay?: number;
  enableAiEnhancer?: boolean;
}) {
  const refOnChange = useRef(onChange);
  refOnChange.current = onChange;
  const handleChangeFixed = useMemo(() => {
    const delay = onChangeDebounceDelay ?? 0;
    const handleChange = (text: string) => {
      refOnChange.current?.(text);
    };
    return delay > 0 ? debounce({ delay }, handleChange) : handleChange;
  }, [onChangeDebounceDelay]);
  return (
    <CodeMirror
      value={value}
      onChange={handleChangeFixed}
      className={cn(styles.editor, className)}
      extensions={[
        basicSetup({
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
        }),
        EditorView.lineWrapping,
        keymap.of(defaultKeymap.concat(indentWithTab)),
        theme === "dark" ? vscodeDark : vscodeLight,
        loadLanguage(language)!,
        enableAiEnhancer ? aiEnhancer(aiEnhancerConfig) : [],
      ]}
    />
  );
}
