import type {
  ActivityEntry,
  ChatMessage,
  Payment,
  PolicyHistoryEntry,
  RecurringPayment,
  SimulationState,
  TreasuryPolicy,
  TreasurySnapshot,
} from "@/types/treasury";
import { DEFAULT_POLICY } from "@/lib/constants";
import { fromBaseUnits, getCachedTokenDecimals } from "@/lib/amounts";
import { generateId } from "@/lib/utils";
import {
  calculateAvailableFunds,
  calculateHealthScore,
} from "@/lib/policy-engine";

const STORAGE_PREFIX = "sphereflow";

function storageKey(userId: string, key: string): string {
  return `${STORAGE_PREFIX}:${userId}:${key}`;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDefaultPolicy(userId: string): TreasuryPolicy {
  return {
    id: generateId(),
    userId,
    ...DEFAULT_POLICY,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

export function getPolicy(userId: string): TreasuryPolicy {
  return readJSON(
    storageKey(userId, "policy"),
    getDefaultPolicy(userId)
  );
}

export function savePolicy(policy: TreasuryPolicy): void {
  writeJSON(storageKey(policy.userId, "policy"), policy);
}

export function getPayments(userId: string): Payment[] {
  return readJSON<Payment[]>(storageKey(userId, "payments"), []);
}

export function savePayment(payment: Payment): void {
  const payments = getPayments(payment.userId);
  payments.unshift(payment);
  writeJSON(storageKey(payment.userId, "payments"), payments);
}

export function updatePayment(
  userId: string,
  paymentId: string,
  updates: Partial<Payment>
): Payment | null {
  const payments = getPayments(userId);
  const index = payments.findIndex((p) => p.id === paymentId);
  if (index === -1) return null;
  payments[index] = { ...payments[index], ...updates };
  writeJSON(storageKey(userId, "payments"), payments);
  return payments[index];
}

export function getActivities(userId: string): ActivityEntry[] {
  return readJSON<ActivityEntry[]>(storageKey(userId, "activities"), []);
}

export function saveActivities(
  userId: string,
  entries: ActivityEntry[]
): void {
  const existing = getActivities(userId);
  writeJSON(storageKey(userId, "activities"), [...entries, ...existing]);
}

export function getChatHistory(userId: string): ChatMessage[] {
  return readJSON<ChatMessage[]>(storageKey(userId, "chat"), []);
}

export function saveChatMessage(userId: string, message: ChatMessage): void {
  const history = getChatHistory(userId);
  history.push(message);
  writeJSON(storageKey(userId, "chat"), history);
}

export function clearChatHistory(userId: string): void {
  writeJSON(storageKey(userId, "chat"), []);
}

export function getRecurringPayments(userId: string): RecurringPayment[] {
  const stored = readJSON<RecurringPayment[]>(
    storageKey(userId, "recurring"),
    []
  );
  if (stored.length > 0) return stored;
  if (userId === "demo-user") return getSeedRecurring();
  return [];
}

export function saveRecurringPayments(
  userId: string,
  payments: RecurringPayment[]
): void {
  writeJSON(storageKey(userId, "recurring"), payments);
}

export function getPolicyHistory(userId: string): PolicyHistoryEntry[] {
  return readJSON<PolicyHistoryEntry[]>(
    storageKey(userId, "policy-history"),
    []
  );
}

export function addPolicyHistory(
  userId: string,
  entry: Omit<PolicyHistoryEntry, "id">
): void {
  const history = getPolicyHistory(userId);
  history.unshift({ ...entry, id: generateId() });
  writeJSON(storageKey(userId, "policy-history"), history);
}

export function getSimulationState(userId: string): SimulationState {
  return readJSON<SimulationState>(storageKey(userId, "simulation"), {
    enabled: true,
    simulatedYield: 12.4,
    simulatedApy: 4.2,
    lastUpdated: new Date().toISOString(),
  });
}

function getSpentInPeriod(
  payments: Payment[],
  days: number
): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return payments
    .filter(
      (p) =>
        p.status === "completed" &&
        new Date(p.executedAt ?? p.createdAt).getTime() > cutoff
    )
    .reduce((sum, p) => sum + p.amount, 0);
}

export function buildSnapshot(
  userId: string,
  balance: number
): TreasurySnapshot {
  const policy = getPolicy(userId);
  const payments = getPayments(userId);
  const reserved = policy.reserveBalance;
  const available = calculateAvailableFunds(balance, reserved);

  const snapshot: TreasurySnapshot = {
    balance,
    reserved,
    available,
    dailySpent: getSpentInPeriod(payments, 1),
    weeklySpent: getSpentInPeriod(payments, 7),
    monthlySpent: getSpentInPeriod(payments, 30),
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    healthScore: 0,
  };

  snapshot.healthScore = calculateHealthScore(snapshot, policy);
  return snapshot;
}

function getSeedRecurring(): RecurringPayment[] {
  const now = new Date();
  return [
    {
      id: generateId(),
      recipient: "@dev-team",
      amount: 15,
      frequency: "weekly",
      category: "Development",
      nextRunAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      memo: "Weekly developer stipend",
    },
    {
      id: generateId(),
      recipient: "@infra-node",
      amount: 8,
      frequency: "monthly",
      category: "Infrastructure",
      nextRunAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
      memo: "Node hosting",
    },
  ];
}

export function syncHistoryToPayments(
  userId: string,
  history: {
    id?: string;
    transferId?: string;
    amount?: string;
    recipient?: string;
    to?: string;
    memo?: string;
    status?: string;
    timestamp?: number | string;
    direction?: string;
  }[]
): void {
  if (!history.length) return;

  const existing = getPayments(userId);
  const existingIds = new Set(
    existing.map((p) => p.transferId).filter(Boolean)
  );

  const decimals = getCachedTokenDecimals();
  const updated = [...existing];
  const newPayments: Payment[] = [];

  for (const entry of history) {
    const transferId = entry.transferId ?? entry.id;
    const amount = fromBaseUnits(entry.amount ?? "0", decimals);

    const ts =
      typeof entry.timestamp === "number"
        ? new Date(entry.timestamp).toISOString()
        : entry.timestamp ?? new Date().toISOString();

    if (transferId) {
      const idx = updated.findIndex((p) => p.transferId === transferId);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], amount };
        continue;
      }
    }

    if (transferId && existingIds.has(transferId)) continue;

    newPayments.push({
      id: generateId(),
      userId,
      type: "instant",
      recipient: entry.recipient ?? entry.to ?? "unknown",
      amount: amount > 0 ? amount : 0,
      status: entry.status === "failed" ? "failed" : "completed",
      category: "Operations",
      memo: entry.memo,
      executedAt: ts,
      createdAt: ts,
      transferId,
    });
  }

  const amountsFixed = updated.some(
    (p, i) => existing[i] && p.amount !== existing[i].amount
  );

  if (newPayments.length > 0 || amountsFixed) {
    writeJSON(storageKey(userId, "payments"), [...newPayments, ...updated]);
  }
}

export function seedDemoData(userId: string, balance: number): void {
  if (userId !== "demo-user") return;
  if (getPayments(userId).length > 0) return;

  const now = Date.now();
  const demoPayments: Payment[] = [
    {
      id: generateId(),
      userId,
      type: "instant",
      recipient: "@alice",
      amount: 5.5,
      status: "completed",
      category: "Development",
      memo: "Bug bounty payout",
      executedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      transferId: "tx_demo_001",
    },
    {
      id: generateId(),
      userId,
      type: "recurring",
      recipient: "@dev-team",
      amount: 15,
      status: "completed",
      category: "Development",
      executedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 25 * 60 * 60 * 1000).toISOString(),
      transferId: "tx_demo_002",
    },
    {
      id: generateId(),
      userId,
      type: "invoice",
      recipient: "@design-co",
      amount: 22,
      status: "pending",
      category: "Marketing",
      memo: "Brand assets invoice #1042",
      createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: "scheduled",
      recipient: "@legal",
      amount: 35,
      status: "scheduled",
      category: "Legal",
      scheduledAt: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
    },
  ];

  writeJSON(storageKey(userId, "payments"), demoPayments);

  const demoActivities: ActivityEntry[] = [
    {
      id: generateId(),
      userId,
      type: "reserve_set",
      title: "Reserved 100 UCT",
      description: "AI mandate: maintain minimum reserve balance",
      timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: "payment_executed",
      title: "Executed payment to @dev-team",
      description: "15 UCT — Weekly developer stipend via Sphere settlement",
      timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: "payment_rejected",
      title: "Rejected payment to @unknown-wallet",
      description: "Policy engine: wallet not on allowed list",
      timestamp: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: "recurring_executed",
      title: "Recurring payment executed",
      description: "8 UCT to @infra-node for node hosting",
      timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  writeJSON(storageKey(userId, "activities"), demoActivities);

  const policy = getDefaultPolicy(userId);
  policy.reserveBalance = 100;
  policy.dailySpendLimit = 25;
  policy.autoApproveThreshold = 10;
  policy.allowedWallets = ["@alice", "@dev-team", "@infra-node", "@design-co", "@legal"];
  savePolicy(policy);

  void balance;
}