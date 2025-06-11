import AiAgentChat from "@/components/advance/ai-agent-chat";
import { CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

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
      <CardContent className="h-[680px] w-[980px] p-0">
        <AiAgentChat />
      </CardContent>
    </>
  );
}
