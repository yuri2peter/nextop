import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { RedirectType, redirect } from "next/navigation";
import { Suspense } from "react";
import FormSub from "./form-sub";
import ParsedResult from "./parsed-result";

const title = "Demo - Web Parser";
const description = "A demo for web parser.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}
export default async function DemoWebParser({
  searchParams,
}: {
  searchParams: Promise<{ url: string }>;
}) {
  const url = (await searchParams).url;
  if (!url) {
    redirect(
      `/demo/web-parser?url=${encodeURIComponent("https://github.com/")}`,
      RedirectType.replace,
    );
  }
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Suspense
        fallback={
          <CardContent className="p-4 ">
            <Skeleton className="w-[600px] h-[480px]" />
          </CardContent>
        }
      >
        <ParsedResult url={url} />
      </Suspense>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <FormSub defaultUrl={url} />
      </CardFooter>
    </>
  );
}
