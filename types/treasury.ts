export type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executing"
  | "completed"
  | "failed"
  | "scheduled"
  | "frozen";

export type PaymentType =
  | "instant"
  | "scheduled"
  | "recurring"
  | "invoice"
  | "escrow";

export type ActivityType =
  | "policy_updated"
  | "reserve_set"
  | "payment_approved"
  | "payment_rejected"
  | "payment_executed"
  | "payment_scheduled"
  | "recurring_created"
  | "recurring_executed"
  | "invoice_created"
  | "wallet_blocked"
  | "wallet_allowed"
  | "freeze_enabled"
  | "freeze_disabled"
  | "budget_alert"
  | "agent_decision"
  | "simulation_yield";

export type PolicyRuleType =
  | "reserve_balance"
  | "daily_spend_limit"
  | "weekly_spend_limit"
  | "monthly_budget"
  | "max_single_transaction"
  | "auto_approve_threshold"
  | "allowed_wallets"
  | "blocked_wallets"
  | "recurring_payments"
  | "emergency_freeze";

export interface TreasuryPolicy {
  id: string;
  userId: string;
  reserveBalance: number;
  dailySpendLimit: number;
  weeklySpendLimit: number;
  monthlyBudget: number;
  maxSingleTransaction: number;
  autoApproveThreshold: number;
  allowedWallets: string[];
  blockedWallets: string[];
  emergencyFreeze: boolean;
  updatedAt: string;
  version: number;
}

export interface RecurringPayment {
  id: string;
  recipient: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly";
  category: string;
  nextRunAt: string;
  active: boolean;
  memo?: string;
}

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  recipient: string;
  amount: number;
  status: PaymentStatus;
  category: string;
  memo?: string;
  scheduledAt?: string;
  executedAt?: string;
  transferId?: string;
  deliveryPending?: boolean;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface TreasurySnapshot {
  balance: number;
  reserved: number;
  available: number;
  dailySpent: number;
  weeklySpent: number;
  monthlySpent: number;
  pendingPayments: number;
  healthScore: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  plan?: TreasuryPlan;
  timestamp: string;
}

export interface TreasuryPlan {
  action:
    | "update_policy"
    | "create_payment"
    | "schedule_payment"
    | "freeze"
    | "unfreeze"
    | "pause_recurring"
    | "report"
    | "respond_only";
  policyUpdates?: Partial<TreasuryPolicy>;
  payment?: {
    recipient: string;
    amount: number;
    type: PaymentType;
    category?: string;
    memo?: string;
    scheduledAt?: string;
  };
  recurring?: Partial<RecurringPayment>;
  message: string;
  confidence: number;
}

export interface PolicyHistoryEntry {
  id: string;
  policyId: string;
  changes: Partial<TreasuryPolicy>;
  source: "ai" | "manual";
  timestamp: string;
}

export interface WalletIdentity {
  chainPubkey: string;
  nametag?: string;
  directAddress?: string;
  sessionId?: string;
}

export interface SpendingReport {
  period: "daily" | "weekly" | "monthly";
  total: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  transactions: Payment[];
  trend: { date: string; amount: number }[];
}

export interface SimulationState {
  enabled: boolean;
  simulatedYield: number;
  simulatedApy: number;
  lastUpdated: string;
}