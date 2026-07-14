import { NextResponse } from "next/server";
import { executePlan } from "@/lib/policy-engine";
import type { TreasuryPlan, TreasuryPolicy, TreasurySnapshot } from "@/types/treasury";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    plan: TreasuryPlan;
    userId: string;
    policy: TreasuryPolicy;
    snapshot: TreasurySnapshot;
  };

  const result = executePlan(body.plan, {
    userId: body.userId,
    policy: body.policy,
    snapshot: body.snapshot,
  });

  return NextResponse.json(result);
}