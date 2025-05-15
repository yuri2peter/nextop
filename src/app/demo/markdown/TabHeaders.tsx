"use client";

import { ProgressBarLink } from "@/components/advance/progress-bar";
import { TabsListPlain, TabsTriggerPlain } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
export default function TabHeaders() {
  const pathname = usePathname().split("/").pop();
  return (
    <TabsListPlain>
      <ProgressBarLink href="/demo/markdown">
        <TabsTriggerPlain active={pathname === "markdown"}>
          Preview
        </TabsTriggerPlain>
      </ProgressBarLink>
      <ProgressBarLink href="/demo/markdown/codemirror">
        <TabsTriggerPlain active={pathname === "codemirror"}>
          Codemirror
        </TabsTriggerPlain>
      </ProgressBarLink>
      <ProgressBarLink href="/demo/markdown/rt">
        <TabsTriggerPlain active={pathname === "rt"}>RT</TabsTriggerPlain>
      </ProgressBarLink>
      <ProgressBarLink href="/demo/markdown/crepe">
        <TabsTriggerPlain active={pathname === "crepe"}>Crepe</TabsTriggerPlain>
      </ProgressBarLink>
    </TabsListPlain>
  );
}
