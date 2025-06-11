import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import Client from "./client";

const title = "Demo - Event Calendar";
const description =
  "Explore and manage your events with our interactive calendar.";

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
      <Client />
    </>
  );
}
