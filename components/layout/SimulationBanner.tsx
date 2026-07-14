"use client";

import { FlaskConical, Wallet, RefreshCw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTreasury } from "@/hooks/use-treasury";
import { formatUCT } from "@/lib/amounts";
import Link from "next/link";

export function SimulationBanner() {
  const { isLive, isConnecting, balance, identity, refresh } = useTreasury();

  if (isLive) {
    return (
      <div className="flex items-center gap-3 border-b border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-2.5 backdrop-blur-sm">
        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10">
          <Wallet className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <p className="text-xs text-emerald-100/90">
          <span className="font-medium">Live testnet</span>
          <span className="mx-2 text-emerald-500/40">·</span>
          <span className="font-mono">
            {identity?.nametag ?? "connected"}
          </span>
          <span className="mx-2 text-emerald-500/40">·</span>
          <span className="font-mono">{formatUCT(balance)}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1.5 text-xs text-emerald-300 hover:bg-emerald-500/10"
          onClick={() => void refresh()}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Sync
        </Button>
        <Badge variant="success" className="shrink-0 font-mono text-[10px]">
          testnet2
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 border-b border-amber-500/15 bg-amber-500/[0.04] px-6 py-2.5">
      <FlaskConical className="h-4 w-4 text-amber-400/90" />
      <p className="text-xs text-amber-100/80">
        <span className="font-medium">Demo environment</span> — simulated data
        only. Connect wallet for real testnet UCT.
      </p>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="ml-auto h-7 border-amber-500/20 text-xs"
      >
        <Link href="/login">Go Live</Link>
      </Button>
    </div>
  );
}