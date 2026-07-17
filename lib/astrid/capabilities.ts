import type { AstridCapability, CapabilityDef, AstridSessionConfig } from "./types";

export const ASTRID_CAPABILITIES: CapabilityDef[] = [
  {
    id: "wallet:read",
    label: "Wallet Read",
    description: "Read balance and identity from Sphere Connect",
    risk: "low",
    defaultGranted: true,
  },
  {
    id: "agent:plan",
    label: "Agent Plan",
    description: "LLM may produce structured treasury plans",
    risk: "low",
    defaultGranted: true,
  },
  {
    id: "policy:update",
    label: "Policy Update",
    description: "Change reserves, limits, and allow/block lists",
    risk: "medium",
    defaultGranted: true,
  },
  {
    id: "policy:freeze",
    label: "Emergency Freeze",
    description: "Block or resume all outgoing payments",
    risk: "high",
    defaultGranted: true,
    approvalGated: true,
  },
  {
    id: "payment:create",
    label: "Create Payment",
    description: "Draft payments into the treasury queue",
    risk: "medium",
    defaultGranted: true,
  },
  {
    id: "payment:send",
    label: "Send Payment",
    description: "Settle UCT via Sphere SDK (capability-gated)",
    risk: "high",
    defaultGranted: true,
    approvalGated: true,
  },
  {
    id: "payment:approve",
    label: "Approve Payment",
    description: "Human or agent approval of pending transfers",
    risk: "high",
    defaultGranted: true,
    approvalGated: true,
  },
  {
    id: "report:generate",
    label: "Reports",
    description: "Generate spending analytics and exports",
    risk: "low",
    defaultGranted: true,
  },
];

export function defaultSessionConfig(): AstridSessionConfig {
  const granted = {} as Record<AstridCapability, boolean>;
  for (const cap of ASTRID_CAPABILITIES) {
    granted[cap.id] = cap.defaultGranted;
  }
  return {
    approvalThresholdUct: 10,
    mode: "enforce",
    granted,
    updatedAt: new Date().toISOString(),
  };
}

export function getCapabilityDef(id: AstridCapability): CapabilityDef | undefined {
  return ASTRID_CAPABILITIES.find((c) => c.id === id);
}

/** Map SphereFlow treasury plan actions → required Astrid capabilities */
export function capabilitiesForPlanAction(
  action: string
): AstridCapability[] {
  switch (action) {
    case "update_policy":
      return ["agent:plan", "policy:update"];
    case "freeze":
    case "unfreeze":
      return ["agent:plan", "policy:freeze"];
    case "create_payment":
    case "schedule_payment":
      // Send is gated separately at settlement time
      return ["agent:plan", "payment:create"];
    case "pause_recurring":
      return ["agent:plan", "policy:update"];
    case "report":
      return ["agent:plan", "report:generate"];
    case "respond_only":
    default:
      return ["agent:plan"];
  }
}