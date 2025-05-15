import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "tool"]),
  content: z.string(),
  data: z.any(),
});

export type Message = z.infer<typeof MessageSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  type: z.literal("call_tool"),
  status: z.enum(["pending", "success", "error"]),
  tool_name: z.string(),
  tool_instruction: z.string(),
  input: z.any(),
  output: z.any(),
});

export type Task = z.infer<typeof TaskSchema>;

export const MemorySchema = z.object({
  short_term: z.string(),
  long_term: z.string(),
});

export type Memory = z.infer<typeof MemorySchema>;

export const ContextSchema = z.object({
  dialog: z.array(MessageSchema).default([]),
  tasks: z.array(TaskSchema).default([]),
  memory: MemorySchema.default({
    short_term: "",
    long_term: "",
  }),
  extra: z
    .object({
      suggested_inputs: z.array(z.string()).max(3).default([]),
      task_summary: z.string().default(""),
      state: z
        .enum(["idle", "thinking", "outputting", "executing", "error"])
        .default("idle"),
    })
    .default({
      suggested_inputs: [],
      task_summary: "",
      state: "idle",
    }),
});

export type Context = z.infer<typeof ContextSchema>;
