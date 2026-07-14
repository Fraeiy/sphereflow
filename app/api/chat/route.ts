import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildChatMessages } from "@/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userMessage } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    userMessage: string;
  };

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "OPENAI_API_KEY not configured. Set it in .env.local",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const chatMessages = buildChatMessages(messages, userMessage);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: chatMessages,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}