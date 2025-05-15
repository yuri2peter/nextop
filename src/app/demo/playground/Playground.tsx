"use client";

import { CardContent } from "@/components/ui/card";

export default function Playground() {
  return (
    <CardContent className="p-4 h-[200px] overflow-y-auto">
      <div>
        <h3>Hello</h3>
        <p>This is a playground for testing.</p>
      </div>
    </CardContent>
  );
}
