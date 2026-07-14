import { streamText } from "ai";
import { buildChatMessages } from "@/ai/prompts";
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

    const result = streamText({
      model,
      messages: chatMessages,
      temperature: 0.3,
      onError: ({ error }) => {
        console.error("[api/chat] stream error:", error);
      },
    });

    return result.toTextStreamResponse();
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