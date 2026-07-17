/** Astrid-aligned capability IDs for treasury agent tools. */
export type AstridCapability =
  | "policy:update"
  | "policy:freeze"
  | "payment:create"
  | "payment:send"
  | "payment:approve"
  | "wallet:read"
  | "report:generate"
  | "agent:plan";

export type CapabilityRisk = "low" | "medium" | "high";

export interface CapabilityDef {
  id: AstridCapability;
  label: string;
  description: string;
  risk: CapabilityRisk;
  /** Default grant state for new sessions */
  defaultGranted: boolean;
  /** Requires human approval when amount exceeds threshold */
  approvalGated?: boolean;
}

export interface AstridSessionConfig {
  /** UCT amount above which payment:send needs explicit approval */
  approvalThresholdUct: number;
  /** Soft mode logs only; hard mode blocks ungated actions */
  mode: "observe" | "enforce";
  granted: Record<AstridCapability, boolean>;
  updatedAt: string;
}

export interface AstridReceipt {
  id: string;
  userId: string;
  capability: AstridCapability;
  action: string;
  summary: string;
  amount?: number;
  recipient?: string;
  status: "allowed" | "denied" | "approval_required" | "executed";
  /** Deterministic fingerprint for audit (not cryptographic on web) */
  fingerprint: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AuthorizeInput {
  capability: AstridCapability;
  action: string;
  summary: string;
  amount?: number;
  recipient?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthorizeResult {
  allowed: boolean;
  status: AstridReceipt["status"];
  reason?: string;
  receipt: AstridReceipt;
}