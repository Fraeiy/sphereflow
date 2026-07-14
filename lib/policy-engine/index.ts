import type {
  ActivityEntry,
  Payment,
  RecurringPayment,
  TreasuryPlan,
  TreasuryPolicy,
  TreasurySnapshot,
} from "@/types/treasury";
import { generateId } from "@/lib/utils";

export interface PolicyValidationResult {
  valid: boolean;
  reason?: string;
  warnings?: string[];
}

export interface PolicyExecutionResult {
  success: boolean;
  message: string;
  activities: ActivityEntry[];
  payment?: Payment;
  policy?: TreasuryPolicy;
}

export function calculateAvailableFunds(
  balance: number,
  reserved: number
): number {
  return Math.max(0, balance - reserved);
}

export function calculateHealthScore(
  snapshot: TreasurySnapshot,
  policy: TreasuryPolicy
): number {
  let score = 100;

  const reserveRatio =
    snapshot.balance > 0 ? snapshot.reserved / snapshot.balance : 1;
  if (reserveRatio < 0.1) score -= 15;
  if (reserveRatio > 0.8) score -= 10;

  const dailyUtilization =
    policy.dailySpendLimit > 0
      ? snapshot.dailySpent / policy.dailySpendLimit
      : 0;
  if (dailyUtilization > 0.9) score -= 20;
  else if (dailyUtilization > 0.7) score -= 10;

  const monthlyUtilization =
    policy.monthlyBudget > 0
      ? snapshot.monthlySpent / policy.monthlyBudget
      : 0;
  if (monthlyUtilization > 0.95) score -= 25;
  else if (monthlyUtilization > 0.8) score -= 10;

  if (policy.emergencyFreeze) score -= 30;
  if (snapshot.pendingPayments > 5) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function validatePayment(
  payment: {
    recipient: string;
    amount: number;
  },
  policy: TreasuryPolicy,
  snapshot: TreasurySnapshot
): PolicyValidationResult {
  const warnings: string[] = [];

  if (policy.emergencyFreeze) {
    return { valid: false, reason: "Treasury is in emergency freeze mode." };
  }

  if (payment.amount <= 0) {
    return { valid: false, reason: "Payment amount must be positive." };
  }

  if (payment.amount > policy.maxSingleTransaction) {
    return {
      valid: false,
      reason: `Amount exceeds maximum single transaction limit of ${policy.maxSingleTransaction} UCT.`,
    };
  }

  if (snapshot.dailySpent + payment.amount > policy.dailySpendLimit) {
    return {
      valid: false,
      reason: `Payment would exceed daily spend limit of ${policy.dailySpendLimit} UCT.`,
    };
  }

  if (snapshot.weeklySpent + payment.amount > policy.weeklySpendLimit) {
    return {
      valid: false,
      reason: `Payment would exceed weekly spend limit of ${policy.weeklySpendLimit} UCT.`,
    };
  }

  if (snapshot.monthlySpent + payment.amount > policy.monthlyBudget) {
    return {
      valid: false,
      reason: `Payment would exceed monthly budget of ${policy.monthlyBudget} UCT.`,
    };
  }

  if (payment.amount > snapshot.available) {
    return {
      valid: false,
      reason: `Insufficient available funds. Available: ${snapshot.available} UCT.`,
    };
  }

  const normalizedRecipient = payment.recipient.toLowerCase();

  if (
    policy.blockedWallets.some(
      (w) => w.toLowerCase() === normalizedRecipient
    )
  ) {
    return {
      valid: false,
      reason: `Recipient ${payment.recipient} is on the blocked wallets list.`,
    };
  }

  if (
    policy.allowedWallets.length > 0 &&
    !policy.allowedWallets.some(
      (w) => w.toLowerCase() === normalizedRecipient
    )
  ) {
    return {
      valid: false,
      reason: `Recipient ${payment.recipient} is not on the allowed wallets list.`,
    };
  }

  if (payment.amount > policy.autoApproveThreshold) {
    warnings.push(
      `Amount exceeds auto-approve threshold (${policy.autoApproveThreshold} UCT). Manual approval required.`
    );
  }

  return { valid: true, warnings };
}

export function shouldAutoApprove(
  amount: number,
  policy: TreasuryPolicy
): boolean {
  return !policy.emergencyFreeze && amount <= policy.autoApproveThreshold;
}

export function executePlan(
  plan: TreasuryPlan,
  context: {
    userId: string;
    policy: TreasuryPolicy;
    snapshot: TreasurySnapshot;
  }
): PolicyExecutionResult {
  const activities: ActivityEntry[] = [];
  const now = new Date().toISOString();

  switch (plan.action) {
    case "update_policy": {
      if (!plan.policyUpdates) {
        return {
          success: false,
          message: "No policy updates specified.",
          activities,
        };
      }

      const updatedPolicy: TreasuryPolicy = {
        ...context.policy,
        ...plan.policyUpdates,
        updatedAt: now,
        version: context.policy.version + 1,
      };

      activities.push({
        id: generateId(),
        userId: context.userId,
        type: "policy_updated",
        title: "Policy updated by AI mandate",
        description: plan.message,
        metadata: { changes: plan.policyUpdates },
        timestamp: now,
      });

      if (plan.policyUpdates.reserveBalance !== undefined) {
        activities.push({
          id: generateId(),
          userId: context.userId,
          type: "reserve_set",
          title: `Reserved ${plan.policyUpdates.reserveBalance} UCT`,
          description: "Reserve balance updated per treasury mandate",
          timestamp: now,
        });
      }

      return {
        success: true,
        message: plan.message,
        activities,
        policy: updatedPolicy,
      };
    }

    case "freeze": {
      const updatedPolicy: TreasuryPolicy = {
        ...context.policy,
        emergencyFreeze: true,
        updatedAt: now,
        version: context.policy.version + 1,
      };

      activities.push({
        id: generateId(),
        userId: context.userId,
        type: "freeze_enabled",
        title: "Emergency freeze activated",
        description: plan.message,
        timestamp: now,
      });

      return {
        success: true,
        message: "Treasury frozen. All outgoing payments blocked.",
        activities,
        policy: updatedPolicy,
      };
    }

    case "unfreeze": {
      const updatedPolicy: TreasuryPolicy = {
        ...context.policy,
        emergencyFreeze: false,
        updatedAt: now,
        version: context.policy.version + 1,
      };

      activities.push({
        id: generateId(),
        userId: context.userId,
        type: "freeze_disabled",
        title: "Emergency freeze lifted",
        description: plan.message,
        timestamp: now,
      });

      return {
        success: true,
        message: "Treasury unfrozen. Payments can resume per policy.",
        activities,
        policy: updatedPolicy,
      };
    }

    case "create_payment":
    case "schedule_payment": {
      if (!plan.payment) {
        return {
          success: false,
          message: "No payment details specified.",
          activities,
        };
      }

      const validation = validatePayment(plan.payment, context.policy, context.snapshot);
      if (!validation.valid) {
        activities.push({
          id: generateId(),
          userId: context.userId,
          type: "payment_rejected",
          title: "Payment rejected by policy engine",
          description: validation.reason ?? "Policy validation failed",
          metadata: { payment: plan.payment },
          timestamp: now,
        });

        return {
          success: false,
          message: validation.reason ?? "Payment rejected by policy engine.",
          activities,
        };
      }

      const autoApprove = shouldAutoApprove(plan.payment.amount, context.policy);
      const payment: Payment = {
        id: generateId(),
        userId: context.userId,
        type: plan.payment.type ?? (plan.action === "schedule_payment" ? "scheduled" : "instant"),
        recipient: plan.payment.recipient,
        amount: plan.payment.amount,
        status: autoApprove ? "approved" : "pending",
        category: plan.payment.category ?? "Operations",
        memo: plan.payment.memo,
        scheduledAt: plan.payment.scheduledAt,
        createdAt: now,
      };

      activities.push({
        id: generateId(),
        userId: context.userId,
        type: autoApprove ? "payment_approved" : "agent_decision",
        title: autoApprove
          ? `Approved payment of ${plan.payment.amount} UCT`
          : `Payment pending approval: ${plan.payment.amount} UCT`,
        description: `To ${plan.payment.recipient} — ${plan.message}`,
        metadata: { paymentId: payment.id },
        timestamp: now,
      });

      return {
        success: true,
        message: autoApprove
          ? `Payment approved. Ready for Sphere settlement.`
          : `Payment queued for manual approval (exceeds ${context.policy.autoApproveThreshold} UCT threshold).`,
        activities,
        payment,
      };
    }

    case "pause_recurring": {
      activities.push({
        id: generateId(),
        userId: context.userId,
        type: "agent_decision",
        title: "Recurring payments paused",
        description: plan.message,
        timestamp: now,
      });

      return {
        success: true,
        message: "All recurring payments paused per mandate.",
        activities,
      };
    }

    case "report":
    case "respond_only":
    default:
      return {
        success: true,
        message: plan.message,
        activities,
      };
  }
}

export function validateRecurringPayment(
  recurring: RecurringPayment,
  policy: TreasuryPolicy
): PolicyValidationResult {
  if (policy.emergencyFreeze) {
    return { valid: false, reason: "Cannot create recurring payments while frozen." };
  }

  if (recurring.amount > policy.maxSingleTransaction) {
    return {
      valid: false,
      reason: `Recurring amount exceeds max single transaction (${policy.maxSingleTransaction} UCT).`,
    };
  }

  return { valid: true };
}