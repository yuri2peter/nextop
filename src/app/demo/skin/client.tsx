"use client";

import { SkinSelector } from "@/components/advance/skin/skin-selector";
import { CardContent } from "@/components/ui/card";

export default function Content() {
  return (
    <CardContent className="p-4 h-[540px] overflow-y-auto">
      <SkinSelector />
    </CardContent>
  );
}
