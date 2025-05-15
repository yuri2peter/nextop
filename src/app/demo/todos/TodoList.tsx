"use client";
import type { DemoTodo } from "@prisma/client";
import { AnimatePresence } from "motion/react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: DemoTodo[] }) {
  return (
    <ul className="block h-[240px] overflow-y-auto space-y-2 overflow-x-hidden">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {todos.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No todos yet
          </div>
        )}
      </AnimatePresence>
    </ul>
  );
}
