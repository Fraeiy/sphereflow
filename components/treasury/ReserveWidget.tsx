"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Fund Allocation</CardTitle>
        <Shield className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-3 overflow-hidden rounded-full bg-muted/20">
          <div className="flex h-full">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${reservePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="h-full bg-[#D4AF37]"
              initial={{ width: 0 }}
              animate={{ width: `${availablePercent}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Reserved</p>
            <p className="text-lg font-semibold tabular-nums text-primary">
              {formatUCTValue(reserved)} <span className="text-xs text-muted-foreground">UCT</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-semibold tabular-nums text-[#D4AF37]">
              {formatUCTValue(available)} <span className="text-xs text-muted-foreground">UCT</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}