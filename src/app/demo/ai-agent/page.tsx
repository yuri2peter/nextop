import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import Chat from "./Chat";

const title = "Demo - AI Agent";
const description = "An example to show how to use AI Agent with tools.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}
export default function DemoAiAgent() {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Chat />
    </>
  );
}
