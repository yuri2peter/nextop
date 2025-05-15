import { callLlm } from "../llm/llm";
import { shortId } from "../string";
import { retry } from "../time";
import type { ContextManager } from "./ContextManager";
import { outputContentPrompt } from "./prompt/output_content";
import { thinkPrompt } from "./prompt/think";
import { ActionSchema, OutputExtraActionSchema } from "./types/action";
import type { Task } from "./types/context";
import type { Tool } from "./types/tool";
import {
  DIVIDER,
  getToolDetails,
  parseLlmResultWithDivider,
  parsePrompt,
} from "./utils";

const MAX_THINKING_TIMES = 15;
export class AiAgent {
  private cm: ContextManager;
  private userInput: string;
  private state:
    | "idle"
    | "thinking"
    | "tool_calling"
    | "outputting"
    | "completed" = "idle";
  private outputInstruction = "";
  private tools: Tool[];
  private thinkingTimes = 0;

  constructor({
    userInput,
    contextManager,
    tools = [],
  }: {
    userInput: string;
    contextManager: ContextManager;
    tools?: Tool[];
  }) {
    this.userInput = userInput;
    this.cm = contextManager;
    this.tools = tools;
  }

  // Main process
  public async process(): Promise<void> {
    switch (this.state) {
      case "idle":
        await this.prepare();
        break;
      case "thinking":
        await this.think();
        break;
      case "tool_calling":
        await this.callTools();
        break;
      case "outputting":
        await this.outputContent();
        break;
      case "completed":
        return;
    }
    await this.process();
  }

  private setState(state: typeof this.state) {
    this.state = state;
  }

  private getToolsInfo() {
    return this.tools.map(getToolDetails);
  }

  private async prepare() {
    this.cm.updateContext((d) => {
      d.memory.short_term = "";
      d.extra.task_summary = "";
      d.extra.suggested_inputs = [];
      d.extra.state = "idle";
      d.dialog.push({
        id: shortId(),
        role: "user",
        content: this.userInput,
      });
    });
    this.setState("thinking");
  }

  // Decide the next action (create tasks, end conversation) based on the current situation, update the short-term memory
  private async think() {
    this.thinkingTimes++;
    if (this.thinkingTimes > MAX_THINKING_TIMES) {
      this.cm.updateContext((d) => {
        d.tasks = [];
        d.extra.state = "outputting";
      });
      this.outputInstruction =
        "Due to exceeding the maximum number of consecutive thinking rounds, the system will forcibly end the conversation. You must fulfill the user's needs as much as possible based on the existing information.";
      this.setState("outputting");
      return;
    }
    // Clean up
    this.cm.updateContext((d) => {
      d.tasks = [];
      d.extra = {
        state: "thinking",
        suggested_inputs: [],
        task_summary: "",
      };
    });
    // Prepare parameters
    const params = this.cm.select((c) => ({
      current_time: new Date().toLocaleString(),
      short_term_memory: c.memory.short_term,
      long_term_memory: c.memory.long_term,
      dialog: c.dialog,
      tools: this.getToolsInfo(),
      thinking_times: this.thinkingTimes,
      max_thinking_times: MAX_THINKING_TIMES,
    }));
    // Get the thinking result
    const [short_term_memory, action] = await retry(async () => {
      const res = await callLlm({
        dialog: [{ role: "system", content: parsePrompt(thinkPrompt, params) }],
        onStream: (content) => {
          const contentFixed = content.split(DIVIDER)[0];
          this.cm.updateContext((d) => {
            d.memory.short_term = contentFixed;
          });
        },
      });
      return parseLlmResultWithDivider(res, ActionSchema);
    })().catch((e) => {
      this.handleError(e, "Thinking stopped by an unexpected error.");
    });

    this.cm.updateContext((d) => {
      d.memory.short_term = short_term_memory;
    });
    // Create tasks
    if (action.type === "create_call_tool_tasks") {
      this.cm.updateContext((d) => {
        d.extra.state = "executing";
        d.extra.task_summary = action.task_summary;
        d.tasks = action.tasks.map((t) => ({
          id: shortId(),
          status: "pending",
          type: t.type,
          tool_name: t.tool_name,
          tool_instruction: t.tool_instruction,
          input: t.input,
          output: null,
        }));
      });
      this.setState("tool_calling");
    } else if (action.type === "output_content") {
      this.cm.updateContext((d) => {
        d.extra.state = "outputting";
      });
      this.outputInstruction = action.output_instruction;
      this.setState("outputting");
    }
  }

  // Execute tasks
  private async callTools() {
    // await this.prepareCallToolTask();
    await Promise.all(
      this.cm
        .select((c) => c.tasks)
        .map(async (task) => {
          await this.executeCallToolTask(task);
        }),
    );
    this.setState("thinking");
  }

  // Execute the call tool task
  private async executeCallToolTask(task: Task) {
    await retry(async () => {
      const tool = this.tools.find((t) => t.name === task.tool_name)!;
      const output = await tool.execute(task.input);
      this.cm.updateContext((d) => {
        const t = d.tasks.find((t) => t.id === task.id)!;
        t.output = output;
      });
    })()
      .then(() => {
        this.cm.updateContext((d) => {
          const t = d.tasks.find((t) => t.id === task.id)!;
          d.dialog.push({
            id: t.id,
            role: "tool",
            content: t.tool_instruction,
            data: {
              tool_name: t.tool_name,
              input: t.input,
              output: t.output,
            },
          });
        });
      })
      .catch((e) => {
        this.cm.updateContext((d) => {
          const t = d.tasks.find((t) => t.id === task.id)!;
          d.dialog.push({
            id: t.id,
            role: "tool",
            content: t.tool_instruction,
            data: {
              tool_name: t.tool_name,
              input: t.input,
              error: e,
            },
          });
        });
      });
  }

  // Execute the output content task
  private async outputContent() {
    const outputId = shortId();
    await retry(async () => {
      const params = this.cm.select((c) => ({
        current_time: new Date().toLocaleString(),
        short_term_memory: c.memory.short_term,
        long_term_memory: c.memory.long_term,
        dialog: c.dialog,
        tools: this.getToolsInfo(),
        output_instruction: this.outputInstruction,
      }));
      const res = await callLlm({
        dialog: [
          { role: "system", content: parsePrompt(outputContentPrompt, params) },
        ],
        onStream: (content) => {
          this.cm.updateContext((d) => {
            const contentFixed = content.split(DIVIDER)[0];
            const prevMessage = d.dialog.find((d) => d.id === outputId);
            if (prevMessage) {
              prevMessage.content = contentFixed;
            } else {
              d.dialog.push({
                id: outputId,
                role: "assistant",
                content: contentFixed,
              });
            }
          });
        },
      });
      return parseLlmResultWithDivider(res, OutputExtraActionSchema);
    })()
      .then(([content, extra_action]) => {
        this.cm.updateContext((d) => {
          d.extra.suggested_inputs = extra_action.suggested_inputs;
          d.extra.task_summary = "";
          d.extra.state = "idle";
          const prevMessage = d.dialog.find((d) => d.id === outputId)!;
          prevMessage.content = content;
          d.memory.long_term = extra_action.long_term_memory;

          // dialog simplification
          const whitelistMessageIds = (() => {
            const ids: string[] = [];
            const lastUserMessageId = d.dialog.findLast(
              (d) => d.role === "user",
            )?.id;
            let meetUserMessage = false;
            for (let i = d.dialog.length - 1; i >= 0 && !meetUserMessage; i--) {
              const message = d.dialog[i];
              ids.push(message.id);
              if (message.id === lastUserMessageId) {
                meetUserMessage = true;
              }
            }
            return ids;
          })();
          d.dialog = d.dialog.filter(
            (d) =>
              !extra_action.delete_message_ids.includes(d.id) ||
              whitelistMessageIds.includes(d.id),
          );
        });
      })
      .catch((e) => {
        this.cm.updateContext((d) => {
          d.extra.task_summary = "";
          d.extra.state = "error";
          const prevMessage = d.dialog.find((d) => d.id === outputId)!;
          prevMessage.content = "Error";
          prevMessage.data = {
            error: e,
          };
        });
      });
    this.setState("completed");
  }

  private handleError(
    e: unknown,
    message = "Unexpected error occurred",
  ): never {
    this.cm.updateContext((d) => {
      d.extra.state = "error";
      d.dialog.push({
        id: shortId(),
        role: "assistant",
        content: message,
        data: {
          error: e,
        },
      });
    });
    throw e;
  }
}
