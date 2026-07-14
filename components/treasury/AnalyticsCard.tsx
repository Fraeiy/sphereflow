"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">{metric}</p>
          {change !== undefined && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-xs font-medium",
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
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}