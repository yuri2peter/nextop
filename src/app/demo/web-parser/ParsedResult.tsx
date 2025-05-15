import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorCodemirror from "@/integrations/markdown/EditorCodemirror";
import MarkdownPreview from "@/integrations/markdown/MarkdownPreview";
import { sleep } from "@/lib/time";
import { scrapeHtml } from "@/lib/utils.server";
import { Suspense } from "react";
import AiSummary from "./AiSummary";
import { parseBasics } from "./parsers/parseBasics";
import { parseIcon } from "./parsers/parseIcon";
import { parseMarkdown } from "./parsers/parseMarkdown";

export default async function ParsedResult({ url }: { url: string }) {
  await sleep(1000);
  const html = await scrapeHtml(url);
  const basics = await parseBasics(html);
  const icons = await parseIcon(url);
  const markdown = parseMarkdown(html);
  return (
    <CardContent className="p-4 ">
      <Tabs defaultValue="tab1" className="w-[600px] h-[480px] overflow-auto">
        <TabsList>
          <TabsTrigger value="tab1">HTML</TabsTrigger>
          <TabsTrigger value="tab3">Icons</TabsTrigger>
          <TabsTrigger value="tab4">Body Markdown</TabsTrigger>
          <TabsTrigger value="tab5">AI Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="overflow-auto">
          <EditorCodemirror language="html" value={html} />
        </TabsContent>
        <TabsContent value="tab2" className="overflow-auto">
          <MarkdownPreview
            text={[
              `### ${basics.title}`,
              basics.description,
              createMarkdownCodeBlock(basics.bodyText),
            ].join("\n")}
          />
        </TabsContent>
        <TabsContent value="tab3" className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Icon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icons.map((icon, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableRow key={index}>
                  <TableCell>
                    {icon.reference}({icon.sizes})
                  </TableCell>
                  <TableCell>
                    <img src={icon.src} alt={icon.reference} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="tab4" className="overflow-auto">
          <MarkdownPreview text={markdown} />
        </TabsContent>
        <TabsContent value="tab5" className="overflow-auto">
          <Suspense
            fallback={
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
              </div>
            }
          >
            <AiSummary
              markdown={markdown}
              title={basics.title}
              description={basics.description}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}

function createMarkdownCodeBlock(text: string, language = "text") {
  return `\`\`\`${language}\n${text}\n\`\`\``;
}
