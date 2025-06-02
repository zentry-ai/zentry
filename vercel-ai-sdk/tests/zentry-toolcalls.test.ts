import dotenv from "dotenv";
dotenv.config();

import { addMemories, createZentry } from "../src";
import { generateText, tool } from "ai";
import { testConfig } from "../config/test-config";
import { z } from "zod";

describe("Tool Calls Tests", () => {
  const { userId } = testConfig;
  jest.setTimeout(30000);

  beforeEach(async () => {
    await addMemories([{
      role: "user",
      content: [{ type: "text", text: "I live in Mumbai" }],
    }], { user_id: userId });
  });

  it("should Execute a Tool Call Using OpenAI", async () => {
    const zentryOpenAI = createZentry({
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      zentryConfig: {
        user_id: userId,
      },
    });

    const result = await generateText({
      model: zentryOpenAI("gpt-4o"),
      tools: {
        weather: tool({
          description: "Get the weather in a location",
          parameters: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
      },
      prompt: "What is the temperature in the city that I live in?",
    });

    // @ts-ignore
    const text = result.response.messages[1].content[0].result.location;

    // Expect text to be a string
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("should Execute a Tool Call Using Anthropic", async () => {
    const zentryAnthropic = createZentry({
      provider: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY,
      zentryConfig: {
        user_id: userId,
      },
    });

    const result = await generateText({
      model: zentryAnthropic("claude-3-haiku-20240307"),
      tools: {
        weather: tool({
          description: "Get the weather in a location",
          parameters: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
      },
      prompt: "What is the temperature in the city that I live in?",
    });

    // @ts-ignore
    const text = result.response.messages[1].content[0].result.location;

    // Expect text to be a string
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });
});
