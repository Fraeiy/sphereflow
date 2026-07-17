import type { AstridReceipt, AstridSessionConfig } from "./types";
import { defaultSessionConfig } from "./capabilities";
import { generateId } from "@/lib/utils";

const PREFIX = "sphereflow:astrid";

function sessionKey(userId: string) {
  return `${PREFIX}:${userId}:session`;
}

function receiptsKey(userId: string) {
  return `${PREFIX}:${userId}:receipts`;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAstridSession(userId: string): AstridSessionConfig {
  const stored = readJSON<AstridSessionConfig | null>(
    sessionKey(userId),
    null
  );
  if (!stored) return defaultSessionConfig();
  const base = defaultSessionConfig();
  return {
    ...base,
    ...stored,
    granted: { ...base.granted, ...stored.granted },
  };
}

export function saveAstridSession(
  userId: string,
  config: AstridSessionConfig
): void {
  writeJSON(sessionKey(userId), {
    ...config,
    updatedAt: new Date().toISOString(),
  });
}

export function getAstridReceipts(userId: string): AstridReceipt[] {
  return readJSON<AstridReceipt[]>(receiptsKey(userId), []);
}

export function saveAstridReceipt(
  userId: string,
  receipt: AstridReceipt
): void {
  const list = getAstridReceipts(userId);
  list.unshift(receipt);
  writeJSON(receiptsKey(userId), list.slice(0, 200));
}

export function makeFingerprint(parts: string[]): string {
  const input = parts.join("|");
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `sf_${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function createReceiptId() {
  return generateId();
}