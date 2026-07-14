import type { TreasuryPlan } from "@/types/treasury";

const PLAN_REGEX = /```json\s*([\s\S]*?)\s*```/;

export function parseTreasuryPlan(content: string): TreasuryPlan | null {
  const match = content.match(PLAN_REGEX);
  if (!match?.[1]) return null;

  try {
    const parsed = JSON.parse(match[1]) as TreasuryPlan;
    if (!parsed.action || !parsed.message) return null;
    return {
      ...parsed,
      confidence: parsed.confidence ?? 0.8,
    };
  } catch {
    return null;
  }
}

export function stripPlanBlock(content: string): string {
  return content.replace(PLAN_REGEX, "").trim();
}