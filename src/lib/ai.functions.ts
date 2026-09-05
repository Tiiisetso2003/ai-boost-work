import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";
import { buildPrompt, type ToolId } from "./tool-prompts";

const RunToolInput = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  fields: z.record(z.string()),
});

export type RunToolResult = { text: string };

export const runTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RunToolInput.parse(input))
  .handler(async ({ data }): Promise<RunToolResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured for this app yet.");
    }

    const { system, prompt } = buildPrompt(data.tool as ToolId, data.fields);
    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = streamText({
      model: gateway(AI_MODEL),
      system,
      prompt,
      temperature: 0.4,
    });

    const text = await result.text;
    return { text };
  });
