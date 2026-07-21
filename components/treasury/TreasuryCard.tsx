"use client";

import { DepthCard } from "@/components/ui/depth-card";
import { SpotlightCard } from "@/components/react-bits";
import { CountUp } from "@/components/react-bits";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TreasuryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  suffix?: string;
  formatAsUct?: boolean;
  className?: string;
  delay?: number;
}

export function TreasuryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  suffix,
  formatAsUct = true,
  className,
}: TreasuryCardProps) {
  const isNumber = typeof value === "number";
  const showUnit = isNumber && formatAsUct && !suffix;
  const decimals = isNumber && formatAsUct ? 2 : 0;

  return (
    <DepthCard tilt className={cn("h-full", className)} innerClassName="h-full">
      <SpotlightCard
        className="h-full rounded-2xl"
        spotlightColor="rgba(232, 163, 23, 0.14)"
      >
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {title}
            </p>
            {Icon && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
                <Icon className="h-4 w-4 text-primary/90" />
              </div>
            )}
          </div>
          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-1.5">
              {isNumber ? (
                <CountUp
                  to={value}
                  decimals={decimals}
                  duration={1.2}
                  className="font-mono text-xl font-medium tracking-tight text-foreground sm:text-2xl"
                />
              ) : (
                <span className="font-mono text-xl font-medium tabular-nums tracking-tight text-foreground sm:text-2xl">
                  {value}
                </span>
              )}
              {showUnit && (
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  UCT
                </span>
              )}
              {suffix && (
                <span className="font-mono text-sm text-muted-foreground">
                  {suffix}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend && (
              <p
                className={cn(
                  "mt-2 font-mono text-xs font-medium",
                  trend.value >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
        </div>
      </SpotlightCard>
    </DepthCard>
  );
}
