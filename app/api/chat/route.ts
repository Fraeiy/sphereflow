import { generateText } from "ai";
import { buildChatMessages, TREASURY_SYSTEM_PROMPT } from "@/ai/prompts";
import { getAiConfigError, getChatModel } from "@/lib/ai/provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, userMessage } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      userMessage: string;
    };

    const configError = getAiConfigError();
    if (configError) {
      return new Response(JSON.stringify({ error: configError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = getChatModel();
    if (!model) {
      return new Response(
        JSON.stringify({ error: "AI model could not be initialized." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const chatMessages = buildChatMessages(messages, userMessage);

    const { text } = await generateText({
      model,
      system: TREASURY_SYSTEM_PROMPT,
      messages: chatMessages,
      temperature: 0.3,
    });

    if (!text.trim()) {
      return new Response(
        JSON.stringify({
          error:
            "AI returned an empty response. Verify your OpenRouter API key and model access.",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";

    console.error("[api/chat]", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}