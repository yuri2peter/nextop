import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";
import Playground from "./client";

const title = "Demo - Playground";
const description = "It's a playground for testing.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}
export default function DemoPlayground() {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Playground />
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <Link href="/" className="w-full">
          <Button className="w-full">Back to Home</Button>
        </Link>
      </CardFooter>
    </>
  );
}
