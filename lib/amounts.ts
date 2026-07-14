import { toHumanReadable } from "@unicitylabs/sphere-sdk";
import { UCT_DECIMALS } from "@/lib/constants";

const DECIMALS_KEY = "sphereflow-uct-decimals";

/** UCT on Sphere testnet uses 18 decimal places (SDK default). */
export function resolveTokenDecimals(decimals?: number): number {
  if (typeof decimals === "number" && decimals > 0) return decimals;
  return UCT_DECIMALS;
}

export function cacheTokenDecimals(decimals: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DECIMALS_KEY, String(decimals));
}

export function getCachedTokenDecimals(): number {
  if (typeof window === "undefined") return UCT_DECIMALS;
  const stored = localStorage.getItem(DECIMALS_KEY);
  if (!stored) return UCT_DECIMALS;
  const parsed = parseInt(stored, 10);
  return parsed > 0 ? parsed : UCT_DECIMALS;
}

/** Convert smallest-unit string/bigint to human-readable number. */
export function fromBaseUnits(
  amount: string | bigint,
  decimals?: number
): number {
  const d = resolveTokenDecimals(decimals);
  const human = toHumanReadable(
    typeof amount === "bigint" ? amount : BigInt(amount || "0"),
    d
  );
  const parsed = parseFloat(human);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Convert human amount to smallest-unit string for Sphere intents. */
export async function toBaseUnits(
  humanAmount: number | string,
  decimals?: number
): Promise<string> {
  const { parseTokenAmount } = await import("@unicitylabs/sphere-sdk");
  const d = resolveTokenDecimals(decimals);
  return parseTokenAmount(humanAmount.toString(), d).toString();
}

export function formatUCTValue(
  amount: number,
  options?: { compact?: boolean }
): string {
  if (!Number.isFinite(amount)) return "0.00";

  if (options?.compact && Math.abs(amount) >= 1_000_000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  const maxFractionDigits =
    Math.abs(amount) < 0.01 ? 4 : Math.abs(amount) < 1 ? 3 : 2;

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFractionDigits,
  });
}

export function formatUCT(amount: number, compact = false): string {
  return `${formatUCTValue(amount, { compact })} UCT`;
}