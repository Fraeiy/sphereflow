"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Shield,
  ArrowLeftRight,
  Ban,
  Calendar,
  AlertTriangle,
  Bot,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ActivityEntry } from "@/types/treasury";
import { cn } from "@/lib/utils";

const iconMap = {
  policy_updated: Shield,
  reserve_set: Shield,
  payment_approved: CheckCircle,
  payment_rejected: XCircle,
  payment_executed: ArrowLeftRight,
  payment_scheduled: Calendar,
  recurring_created: Calendar,
  recurring_executed: ArrowLeftRight,
  invoice_created: ArrowLeftRight,
  wallet_blocked: Ban,
  wallet_allowed: CheckCircle,
  freeze_enabled: AlertTriangle,
  freeze_disabled: CheckCircle,
  budget_alert: AlertTriangle,
  agent_decision: Bot,
  simulation_yield: TrendingUp,
};

const colorMap = {
  policy_updated: "text-primary",
  reserve_set: "text-primary",
  payment_approved: "text-emerald-400",
  payment_rejected: "text-red-400",
  payment_executed: "text-emerald-400",
  payment_scheduled: "text-amber-400",
  recurring_created: "text-amber-400",
  recurring_executed: "text-emerald-400",
  invoice_created: "text-primary",
  wallet_blocked: "text-red-400",
  wallet_allowed: "text-emerald-400",
  freeze_enabled: "text-red-400",
  freeze_disabled: "text-emerald-400",
  budget_alert: "text-amber-400",
  agent_decision: "text-primary",
  simulation_yield: "text-[#D4AF37]",
};

interface ActivityCardProps {
  activity: ActivityEntry;
  className?: string;
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const Icon = iconMap[activity.type] ?? Bot;
  const color = colorMap[activity.type] ?? "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20",
        className
      )}
    >
      <div className={cn("mt-0.5 rounded-lg bg-muted/10 p-2", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{activity.title}</p>
          <time className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.timestamp), {
              addSuffix: true,
            })}
          </time>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {activity.description}
        </p>
      </div>
    </div>
  );
}