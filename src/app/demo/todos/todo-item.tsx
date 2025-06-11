"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { sleep } from "@/lib/time";
import type { DemoTodo } from "@prisma/client";
import { motion } from "motion/react";
import { useState } from "react";
import { completeTodo, deleteTodo } from "./actions";

export default function TodoItem({
  todo,
  ref,
}: { todo: DemoTodo; ref?: React.Ref<HTMLLIElement> }) {
  const [ok, setOk] = useState(false);
  const okFix = todo.completed || ok;
  const id = `todo-${todo.id}`;

  const handleChange = async () => {
    setOk(true);
    await completeTodo({ id: todo.id });
    await sleep(600);
    await deleteTodo({ id: todo.id });
  };

  return (
    <motion.li
      ref={ref}
      className="hover:bg-primary/10 rounded-md relative overflow-hidden h-8"
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring" }}
    >
      <motion.div
        className="flex items-center gap-2 p-2 relative"
        animate={{ bottom: okFix ? "100%" : "0%" }}
      >
        <Checkbox id={id} checked={false} onCheckedChange={handleChange} />
        <Label htmlFor={id} className="flex-1 cursor-pointer">
          {todo.title}
        </Label>
      </motion.div>
      <motion.div
        className="flex items-center gap-2 p-2 absolute top-full w-full"
        animate={{ top: okFix ? "0" : "100%" }}
      >
        <Checkbox checked={true} />
        <Label className="flex-1 cursor-pointer line-through text-muted-foreground">
          {todo.title}
        </Label>
      </motion.div>
    </motion.li>
  );
}
