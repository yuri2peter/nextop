import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import { getTodos } from "./actions";
import FormAddTodo from "./form-add-todo";
import TodoList from "./todo-list";
const title = "Demo - Todo List";
const description =
  "A simple todo list demo built with conform, motion and prisma.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
  };
}

export default async function DemoTodos() {
  const todos = await getTodos();
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <TodoList todos={todos} />
      </CardContent>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <FormAddTodo />
      </CardFooter>
    </>
  );
}
