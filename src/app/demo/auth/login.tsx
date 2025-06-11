"use client";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { login } from "./actions";
import { LoginFormSchema } from "./defines";

export default function Login() {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    const { success, error } = await login(values);
    if (!success) {
      form.setError("root", {
        message: error,
      });
    }
  }
  const busy = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <CardContent className="p-4 space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Bob" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="123456" type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError />
        </CardContent>
        <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
          <Button type="submit" disabled={busy} className="w-full">
            Login
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
