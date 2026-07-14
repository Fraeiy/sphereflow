"use server";

import { executePlan } from "@/lib/policy-engine";
import type { TreasuryPlan, TreasuryPolicy, TreasurySnapshot } from "@/types/treasury";

export async function executeTreasuryPlan(
  plan: TreasuryPlan,
  context: {
    userId: string;
    policy: TreasuryPolicy;
    snapshot: TreasurySnapshot;
  }
) {
  return executePlan(plan, context);
}