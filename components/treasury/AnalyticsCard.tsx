"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { DepthCard } from "@/components/ui/depth-card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  metric: string;
  change?: number;
  period: string;
  description?: string;
}

export function AnalyticsCard({
  title,
  metric,
  change,
  period,
  description,
}: AnalyticsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <DepthCard tilt className="h-full" innerClassName="h-full">
      <div className="flex h-full flex-col p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-auto pt-4 font-mono text-2xl font-medium tabular-nums tracking-tight">
          {metric}
        </p>
        {change !== undefined && (
          <div
            className={cn(
              "mt-2 flex items-center gap-1 font-mono text-xs font-medium",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}% vs {period}
          </div>
        )}
        {description && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </DepthCard>
  );
}