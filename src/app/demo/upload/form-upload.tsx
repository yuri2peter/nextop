"use client";
import { EnhancedFileUploader } from "@/components/extension/file-upload";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SavedFileInfo } from "@/integrations/file-storage";
import { uploadFile } from "@/lib/file.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  fileCount: z.number().min(1),
});

export default function FormUpload() {
  const dropzoneOptions = {
    maxFiles: 4,
    maxSize: 1024 * 1024 * 32,
    multiple: true,
  };
  const [files, setFiles] = useState<File[] | null>(null);
  const [savedFiles, setSavedFiles] = useState<SavedFileInfo[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileCount: files?.length ?? 0,
    },
  });
  useEffect(() => {
    form.setValue("fileCount", files?.length ?? 0);
    form.clearErrors("fileCount");
  }, [files?.length, form.setValue, form.clearErrors]);
  async function onSubmit() {
    try {
      const results = await submitFilesUpload(files ?? []);
      setSavedFiles(results);
      toast.success(`${results.length} files uploaded successfully`);
      setFiles(null);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <CardContent className="p-4">
          <EnhancedFileUploader
            dropzoneOptions={dropzoneOptions}
            value={files}
            onValueChange={setFiles}
            description="Max file size: 32MB"
          />
          <FormField
            control={form.control}
            name="fileCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="prose prose-sm">
            <ul>
              {savedFiles.map((file) => (
                <li key={file.key}>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

async function submitFilesUpload(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      return uploadFile(file);
    }),
  );
}
