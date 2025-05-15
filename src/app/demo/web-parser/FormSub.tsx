"use client";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { type InputParams, InputParamsSchema } from "./types";

export default function FormSub({ defaultUrl }: { defaultUrl: string }) {
  const navigate = useProgressNavigate();
  const form = useForm<InputParams>({
    resolver: zodResolver(InputParamsSchema),
    defaultValues: {
      url: defaultUrl,
    },
  });
  async function onSubmit({ url }: InputParams) {
    navigate(`/demo/web-parser?url=${encodeURIComponent(url)}`);
  }
  return (
    <Form {...form}>
      <form
        className="flex gap-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
        method="get"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  type="text"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          asChild
          className="cursor-pointer select-none"
        >
          <motion.button
            animate={{
              scale: form.formState.isSubmitting ? 0.8 : 1,
              opacity: form.formState.isSubmitting ? 0.5 : 1,
            }}
            whileHover={{ scale: 1.05 }}
          >
            Submit
          </motion.button>
        </Button>
      </form>
    </Form>
  );
}
