"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PolicyCard } from "@/components/treasury/PolicyCard";
import { RuleEditor } from "@/components/treasury/RuleEditor";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTreasury } from "@/hooks/use-treasury";
import {
  addPolicyHistory,
  getPolicyHistory,
} from "@/services/treasury-store";
import type { TreasuryPolicy } from "@/types/treasury";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle } from "lucide-react";

export default function PoliciesPage() {
  const { policy, updatePolicy, userId, isLoading } = useTreasury();
  const [editField, setEditField] = useState<keyof TreasuryPolicy | null>(null);
  const [history] = useState(() => getPolicyHistory(userId));

  if (isLoading || !policy) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  const handleSave = (updates: Partial<TreasuryPolicy>) => {
    updatePolicy(updates);
    addPolicyHistory(userId, {
      policyId: policy.id,
      changes: updates,
      source: "manual",
      timestamp: new Date().toISOString(),
    });
    toast.success("Policy updated");
  };

  const policyCards = [
    {
      type: "reserve_balance" as const,
      field: "reserveBalance" as const,
      title: "Reserve Balance",
      description: "Minimum UCT held in reserve, never spent",
      value: policy.reserveBalance,
    },
    {
      type: "daily_spend_limit" as const,
      field: "dailySpendLimit" as const,
      title: "Daily Spend Limit",
      description: "Maximum UCT spendable per day",
      value: policy.dailySpendLimit,
    },
    {
      type: "weekly_spend_limit" as const,
      field: "weeklySpendLimit" as const,
      title: "Weekly Spend Limit",
      description: "Maximum UCT spendable per week",
      value: policy.weeklySpendLimit,
    },
    {
      type: "monthly_budget" as const,
      field: "monthlyBudget" as const,
      title: "Monthly Budget",
      description: "Total monthly spending cap",
      value: policy.monthlyBudget,
    },
    {
      type: "max_single_transaction" as const,
      field: "maxSingleTransaction" as const,
      title: "Max Single Transaction",
      description: "Largest allowed single payment",
      value: policy.maxSingleTransaction,
    },
    {
      type: "auto_approve_threshold" as const,
      field: "autoApproveThreshold" as const,
      title: "Auto-Approve Threshold",
      description: "Payments below this auto-execute",
      value: policy.autoApproveThreshold,
    },
    {
      type: "allowed_wallets" as const,
      field: "allowedWallets" as const,
      title: "Allowed Wallets",
      description: "Only these recipients permitted (empty = all)",
      value: policy.allowedWallets,
    },
    {
      type: "blocked_wallets" as const,
      field: "blockedWallets" as const,
      title: "Blocked Wallets",
      description: "Recipients always rejected",
      value: policy.blockedWallets,
    },
    {
      type: "emergency_freeze" as const,
      field: "emergencyFreeze" as const,
      title: "Emergency Freeze",
      description: "Block all outgoing payments",
      value: policy.emergencyFreeze,
      onToggle: (enabled: boolean) => handleSave({ emergencyFreeze: enabled }),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Policies"
        description="AI-generated rules, editable and enforced by the policy engine"
      >
        <Badge variant="secondary" className="font-mono text-xs">
          v{policy.version}
        </Badge>
      </PageHeader>

      {policy.emergencyFreeze && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">
            Emergency freeze active — all outgoing payments blocked.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {policyCards.map((card) => (
          <PolicyCard
            key={card.field}
            type={card.type}
            title={card.title}
            description={card.description}
            value={card.value}
            enabled={
              card.field === "emergencyFreeze" ? !policy.emergencyFreeze : true
            }
            onToggle={card.onToggle}
            onEdit={() => setEditField(card.field)}
          />
        ))}
      </div>

      <div>
        <p className="section-label mb-4">Audit Trail</p>
        {history.length === 0 ? (
          <div className="depth-panel rounded-2xl px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No policy changes recorded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="depth-panel flex items-center justify-between rounded-xl px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={entry.source === "ai" ? "default" : "secondary"}
                    className="font-mono text-[10px] uppercase"
                  >
                    {entry.source}
                  </Badge>
                  <span className="text-muted-foreground">
                    {Object.keys(entry.changes).join(", ")} updated
                  </span>
                </div>
                <time className="font-mono text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.timestamp), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>

      <RuleEditor
        open={!!editField}
        policy={policy}
        field={editField}
        onClose={() => setEditField(null)}
        onSave={handleSave}
      />
    </div>
  );
}