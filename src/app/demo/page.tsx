import { ProgressBarLink } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

const title = "Demo - Navigation";
const description = "Links to all the demos.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}

export default function DemoIndex() {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 prose">
        <ul className="grid grid-cols-2 gap-0 overflow-y-auto">
          {[
            {
              label: "Todo List",
              to: "/demo/todos",
            },
            {
              label: "Auth",
              to: "/demo/auth",
            },
            {
              label: "Upload",
              to: "/demo/upload",
            },
            {
              label: "Appearance",
              to: "/demo/appearance",
            },
            {
              label: "Playground",
              to: "/demo/playground",
            },
            {
              label: "AI Agent",
              to: "/demo/ai-agent",
            },
            {
              label: "Markdown",
              to: "/demo/markdown",
            },
            {
              label: "Web Parser",
              to: "/demo/web-parser",
            },
            {
              label: "Event Calendar",
              to: "/demo/event-calendar",
            },
            {
              label: "Skin",
              to: "/demo/skin",
            },
          ]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(({ label, to }) => (
              <li key={to} className="">
                <ProgressBarLink href={to}>{label}</ProgressBarLink>
              </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <ProgressBarLink href="/" className="w-full">
          <Button className="w-full">Back to Home</Button>
        </ProgressBarLink>
      </CardFooter>
    </>
  );
}
