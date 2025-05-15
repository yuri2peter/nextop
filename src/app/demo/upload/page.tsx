import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import FormUpload from "./FormUpload";

const title = "Demo - Upload";
const description = "An example of how to upload files.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}

export default async function DemoUpload() {
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <FormUpload />
    </>
  );
}
