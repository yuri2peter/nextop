import { MagicCard } from "@/components/magicui/magic-card";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env.server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Demo",
    description: "A set of demos for you to play with.",
  };
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!env.ENABLE_DEMO) {
    notFound();
  }
  return (
    <div className="h-screen flex justify-center items-center bg-accent">
      <Card className="p-0 max-w-screen-lg w-auto min-w-md shadow-none border-none">
        <MagicCard className="p-0">{children}</MagicCard>
      </Card>
    </div>
  );
}
