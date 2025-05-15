"use server";

import { sleep } from "@/lib/time";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { verifyDemoEnabled } from "../dal";
const prisma = new PrismaClient();

export async function addTodo({ title }: { title: string }) {
  verifyDemoEnabled();
  await sleep(300);
  await prisma.demoTodo.create({
    data: { title: title.trim() || new Date().toISOString() },
  });
  revalidatePath("/demo/todos");
}

export async function completeTodo({ id }: { id: string }) {
  verifyDemoEnabled();
  await prisma.demoTodo.update({
    where: { id },
    data: { completed: true },
  });
}

export async function deleteTodo({ id }: { id: string }) {
  verifyDemoEnabled();
  await prisma.demoTodo.delete({
    where: { id },
  });
  revalidatePath("/demo/todos");
}

export async function getTodos() {
  verifyDemoEnabled();
  const todos = await prisma.demoTodo.findMany();
  return todos;
}
