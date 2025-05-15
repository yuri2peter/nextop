"use client";

import EditorCodemirror from "@/integrations/markdown/EditorCodemirror";
import { useState } from "react";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  const [value, setValue] = useState(example);
  return <EditorCodemirror value={value} onChange={setValue} />;
}
