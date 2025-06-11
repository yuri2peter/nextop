import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import Content from "./client";

const title = "Demo - Skin";
const description = "Set skin for the app.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}

export default async function DemoAppearance() {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Content />
    </>
  );
}
