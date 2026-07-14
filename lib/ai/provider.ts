import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

function isOpenRouterKey(key: string) {
  return key.startsWith("sk-or-");
}

function isUsableKey(key: string | undefined) {
  return Boolean(key && key.length >= 20);
}

function resolveApiKey() {
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const forcedProvider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (isUsableKey(openRouterKey)) {
    return { provider: "openrouter" as const, apiKey: openRouterKey! };
  }

  if (
    isUsableKey(openAiKey) &&
    (forcedProvider === "openrouter" || isOpenRouterKey(openAiKey!))
  ) {
    return { provider: "openrouter" as const, apiKey: openAiKey! };
  }

  if (isUsableKey(openAiKey)) {
    return { provider: "openai" as const, apiKey: openAiKey! };
  }

  return null;
}

export function getChatModel(): LanguageModel | null {
  const resolved = resolveApiKey();
  if (!resolved) return null;

  if (resolved.provider === "openrouter") {
    const provider = createOpenAI({
      apiKey: resolved.apiKey,
      baseURL: OPENROUTER_BASE_URL,
      headers: {
        "HTTP-Referer":
          process.env.OPENROUTER_HTTP_REFERER ??
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "https://sphereflow-psi.vercel.app",
        "X-Title": process.env.OPENROUTER_APP_NAME ?? "SphereFlow",
      },
    });

    const modelId = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
    // OpenRouter is Chat Completions–compatible; avoid the Responses API.
    return provider.chat(modelId);
  }

  const provider = createOpenAI({ apiKey: resolved.apiKey });
  const modelId = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  return provider.chat(modelId);
}

export function getAiConfigError(): string | null {
  if (resolveApiKey()) return null;

  return "No AI API key configured. In Vercel → Project → Settings → Environment Variables, add OPENROUTER_API_KEY (or OPENAI_API_KEY) with your full OpenRouter key (sk-or-v1-...), set AI_PROVIDER=openrouter, then redeploy.";
}