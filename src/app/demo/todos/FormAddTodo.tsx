"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { addTodo } from "./actions";

export default function FormAddTodo() {
  const form = useForm<{ title: string }>();
  return (
    <form
      className="flex gap-4 w-full"
      onSubmit={form.handleSubmit(async (data) => {
        await addTodo(data);
        form.reset();
      })}
    >
      <Input
        {...form.register("title", { required: true, minLength: 1 })}
        className="flex-1"
        autoFocus
        placeholder="Add a todo"
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
          Add
        </motion.button>
      </Button>
    </form>
  );
}
