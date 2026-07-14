"use client";

import { motion } from "framer-motion";
import { formatUCTValue } from "@/lib/amounts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface TreasuryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  suffix?: string;
  /** When false, renders the number without UCT formatting (e.g. health score). */
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
  delay = 0,
}: TreasuryCardProps) {
  const isNumber = typeof value === "number";
  const displayValue =
    isNumber && formatAsUct
      ? formatUCTValue(value)
      : isNumber
        ? value.toLocaleString("en-US")
        : value;
  const showUnit = isNumber && formatAsUct && !suffix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tabular-nums tracking-tight">
              {displayValue}
            </span>
            {showUnit && (
              <span className="text-sm font-medium text-muted-foreground">
                UCT
              </span>
            )}
            {suffix && (
              <span className="text-sm font-normal text-muted-foreground">
                {suffix}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                trend.value >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}