"use client";

import { useTreasuryContext } from "@/components/providers/treasury-provider";

export function useTreasury() {
  return useTreasuryContext();
}