"use client";

import EditorRt from "@/integrations/markdown/EditorRt";
import { useState } from "react";
import { example } from "./example";

export default function DemoMarkdownPreview() {
  const [value, setValue] = useState(example);
  return <EditorRt value={value} onChange={setValue} />;
}
