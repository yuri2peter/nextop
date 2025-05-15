import { z } from "zod";

export const CreateTasksActionSchema = z.object({
  type: z.literal("create_call_tool_tasks"),
  task_summary: z
    .string()
    .describe(
      "A brief description of the task, shown to the user to ease waiting anxiety. For example: 'Querying Beijing weather'",
    ),
  tasks: z.array(
    z.object({
      type: z.literal("call_tool"),
      tool_name: z.string().describe("Name of the tool"),
      tool_instruction: z
        .string()
        .describe(
          "A complete and independent instruction for invoking the tool",
        ),
      input: z
        .record(z.any())
        .optional()
        .describe(
          "Input(parameters) for the tool, following the tool's schema",
        ),
    }),
  ),
});

export const OutputActionSchema = z.object({
  type: z.literal("output_content"),
  output_instruction: z
    .string()
    .describe(
      "Instructions for how the output node should present the content. Must clearly specify the output language, which should generally match the user's language. The instruction should be concise, as the output node can access all context.",
    ),
});
export const ActionSchema = z.union([
  CreateTasksActionSchema,
  OutputActionSchema,
]);

export const OutputExtraActionSchema = z.object({
  type: z.literal("output_extra_action"),
  suggested_inputs: z
    .array(z.string())
    .max(3)
    .describe("Predict possible user inputs (up to 3)"),
  long_term_memory: z.string().describe("New long-term memory content"),
  delete_message_reason: z
    .string()
    .describe(
      "Reason for deleting these messages, or for not deleting any, to be shown to the user",
    ),
  delete_message_ids: z
    .array(z.string())
    .describe(
      "IDs of messages to be deleted, used to streamline the chat history",
    ),
});
