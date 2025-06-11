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
import TabHeaders from "./tab-headers";

const title = "Demo - Markdown";
const description = "A set of markdown demos.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}

export default function DemoIndex({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <TabHeaders />
        <div className="mt-4 h-[420px] w-[860px] overflow-auto">{children}</div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <ProgressBarLink href="/demo" className="w-full">
          <Button className="w-full">Back to Demos</Button>
        </ProgressBarLink>
      </CardFooter>
    </>
  );
}
