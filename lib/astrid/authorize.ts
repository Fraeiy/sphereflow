import {
  getCapabilityDef,
  capabilitiesForPlanAction,
} from "./capabilities";
import {
  createReceiptId,
  getAstridSession,
  makeFingerprint,
  saveAstridReceipt,
} from "./receipts";
import type {
  AuthorizeInput,
  AuthorizeResult,
  AstridCapability,
} from "./types";

/**
 * Astrid-aligned authorization gate.
 * Checks capability grants + amount thresholds before money/policy actions.
 */
export function authorizeAction(
  userId: string,
  input: AuthorizeInput
): AuthorizeResult {
  const session = getAstridSession(userId);
  const def = getCapabilityDef(input.capability);
  const timestamp = new Date().toISOString();
  const fingerprint = makeFingerprint([
    userId,
    input.capability,
    input.action,
    String(input.amount ?? ""),
    input.recipient ?? "",
    timestamp,
  ]);

  const baseReceipt = {
    id: createReceiptId(),
    userId,
    capability: input.capability,
    action: input.action,
    summary: input.summary,
    amount: input.amount,
    recipient: input.recipient,
    fingerprint,
    metadata: input.metadata,
    timestamp,
  };

  if (session.mode === "observe") {
    const receipt = {
      ...baseReceipt,
      status: "allowed" as const,
    };
    saveAstridReceipt(userId, receipt);
    return { allowed: true, status: "allowed", receipt };
  }

  if (!session.granted[input.capability]) {
    const receipt = {
      ...baseReceipt,
      status: "denied" as const,
    };
    saveAstridReceipt(userId, receipt);
    return {
      allowed: false,
      status: "denied",
      reason: `Capability ${input.capability} is not granted in this Astrid session.`,
      receipt,
    };
  }

  const bypassAmount =
    input.metadata?.manualApproval === true ||
    input.metadata?.bypassAmountGate === true;

  if (
    !bypassAmount &&
    def?.approvalGated &&
    input.amount !== undefined &&
    input.amount > session.approvalThresholdUct
  ) {
    const receipt = {
      ...baseReceipt,
      status: "approval_required" as const,
    };
    saveAstridReceipt(userId, receipt);
    return {
      allowed: false,
      status: "approval_required",
      reason: `Amount ${input.amount} UCT exceeds Astrid approval threshold (${session.approvalThresholdUct} UCT). Approve manually in Payments.`,
      receipt,
    };
  }

  const receipt = {
    ...baseReceipt,
    status: "executed" as const,
  };
  saveAstridReceipt(userId, receipt);
  return { allowed: true, status: "executed", receipt };
}

export function authorizePlan(
  userId: string,
  action: string,
  opts?: { amount?: number; recipient?: string; summary?: string }
): { allowed: boolean; reason?: string; capabilities: AstridCapability[] } {
  const caps = capabilitiesForPlanAction(action);
  for (const cap of caps) {
    const result = authorizeAction(userId, {
      capability: cap,
      action,
      summary: opts?.summary ?? `Plan action: ${action}`,
      amount: opts?.amount,
      recipient: opts?.recipient,
    });
    if (!result.allowed) {
      return {
        allowed: false,
        reason: result.reason,
        capabilities: caps,
      };
    }
  }
  return { allowed: true, capabilities: caps };
}