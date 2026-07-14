"use client";

import { FlaskConical, Wallet, RefreshCw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTreasury } from "@/hooks/use-treasury";
import { formatUCT } from "@/lib/utils";
import Link from "next/link";

export function SimulationBanner() {
  const { isLive, isConnecting, balance, identity, refresh } = useTreasury();

  if (isLive) {
    return (
      <div className="flex items-center gap-3 border-b border-emerald-500/20 bg-emerald-500/5 px-6 py-2">
        <Wallet className="h-4 w-4 text-emerald-400" />
        <p className="text-xs text-emerald-200/90">
          <span className="font-medium">Live Testnet</span>
          {" — "}
          {identity?.nametag ?? "Sphere wallet connected"}
          {" · "}
          Balance: {formatUCT(balance)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1 text-xs text-emerald-300"
          onClick={() => void refresh()}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Refresh
        </Button>
        <Badge variant="success" className="shrink-0">
          testnet2
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 border-b border-amber-500/20 bg-amber-500/5 px-6 py-2">
      <FlaskConical className="h-4 w-4 text-amber-400" />
      <p className="text-xs text-amber-200/80">
        <span className="font-medium">Demo Mode</span> — Connect your Sphere
        wallet to use real testnet UCT. Simulation yield is for demonstration
        only.
      </p>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="ml-auto h-7 text-xs"
      >
        <Link href="/login">Connect Wallet</Link>
      </Button>
    </div>
  );
}