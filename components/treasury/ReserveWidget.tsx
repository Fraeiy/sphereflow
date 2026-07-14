"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { DepthCard } from "@/components/ui/depth-card";
import { formatUCTValue } from "@/lib/amounts";

interface ReserveWidgetProps {
  reserved: number;
  available: number;
  balance: number;
}

export function ReserveWidget({ reserved, available, balance }: ReserveWidgetProps) {
  const reservePercent = balance > 0 ? (reserved / balance) * 100 : 0;
  const availablePercent = balance > 0 ? (available / balance) * 100 : 0;

  return (
    <DepthCard tilt className="h-full" innerClassName="h-full">
      <div className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Fund Allocation
          </p>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
            <Shield className="h-4 w-4 text-primary/90" />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
            <div className="flex h-full">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${reservePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="h-full bg-[#C9A227]"
                initial={{ width: 0 }}
                animate={{ width: `${availablePercent}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Reserved
              </p>
              <p className="mt-1 font-mono text-xl font-medium tabular-nums text-primary">
                {formatUCTValue(reserved)}
                <span className="ml-1 text-xs text-muted-foreground">UCT</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Available
              </p>
              <p className="mt-1 font-mono text-xl font-medium tabular-nums text-[#C9A227]">
                {formatUCTValue(available)}
                <span className="ml-1 text-xs text-muted-foreground">UCT</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DepthCard>
  );
}