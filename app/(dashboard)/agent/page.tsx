"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAstrid } from "@/hooks/use-astrid";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Box, ShieldCheck, Fingerprint, Layers } from "lucide-react";

const riskColor = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

const statusVariant = {
  allowed: "secondary" as const,
  denied: "destructive" as const,
  approval_required: "warning" as const,
  executed: "success" as const,
};

export default function AgentRuntimePage() {
  const {
    session,
    receipts,
    capabilities,
    ready,
    updateSession,
    setCapability,
  } = useAstrid();

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const grantedCount = Object.values(session.granted).filter(Boolean).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Astrid-aligned"
        title="Agent Runtime"
        description="Capability grants, approval thresholds, and session receipts — modeled on Unicity Astrid OS agent safety."
      >
        <Badge variant="secondary" className="font-mono text-xs">
          {session.mode === "enforce" ? "Enforce" : "Observe"} · {grantedCount}/
          {capabilities.length}
        </Badge>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="depth-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Box className="h-4 w-4 text-primary" />
            <p className="text-[10px] uppercase tracking-[0.14em]">Stack</p>
          </div>
          <p className="mt-2 text-sm font-medium">Sphere + Astrid model</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Policy engine + capability gates
          </p>
        </div>
        <div className="depth-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-[10px] uppercase tracking-[0.14em]">Mode</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm">
              {session.mode === "enforce" ? "Enforcing" : "Observe only"}
            </span>
            <Switch
              checked={session.mode === "enforce"}
              onCheckedChange={(on) =>
                updateSession({ mode: on ? "enforce" : "observe" })
              }
            />
          </div>
        </div>
        <div className="depth-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="h-4 w-4 text-primary" />
            <p className="text-[10px] uppercase tracking-[0.14em]">
              Approval threshold
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="number"
              min={0}
              step={1}
              value={session.approvalThresholdUct}
              onChange={(e) =>
                updateSession({
                  approvalThresholdUct: parseFloat(e.target.value) || 0,
                })
              }
              className="h-9 font-mono tabular-nums"
            />
            <span className="shrink-0 text-xs text-muted-foreground">UCT</span>
          </div>
        </div>
        <div className="depth-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fingerprint className="h-4 w-4 text-primary" />
            <p className="text-[10px] uppercase tracking-[0.14em]">Receipts</p>
          </div>
          <p className="mt-2 font-mono text-2xl font-medium tabular-nums">
            {receipts.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Session audit trail</p>
        </div>
      </div>

      <div>
        <p className="section-label mb-3 sm:mb-4">Capabilities</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="depth-panel flex items-start justify-between gap-3 rounded-2xl p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{cap.label}</p>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      riskColor[cap.risk]
                    )}
                  >
                    {cap.risk}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {cap.id}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
              <Switch
                checked={session.granted[cap.id]}
                onCheckedChange={(on) => setCapability(cap.id, on)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="section-label mb-3 sm:mb-4">Session receipts</p>
        {receipts.length === 0 ? (
          <div className="depth-panel rounded-2xl px-4 py-10 text-center text-sm text-muted-foreground">
            No agent actions yet. Use Treasury Chat or create a payment to emit
            receipts.
          </div>
        ) : (
          <div className="space-y-2">
            {receipts.slice(0, 30).map((r) => (
              <div
                key={r.id}
                className="depth-panel flex flex-col gap-2 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[r.status]} className="text-[10px]">
                      {r.status}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {r.capability}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{r.summary}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/80">
                    {r.fingerprint}
                    {r.amount !== undefined ? ` · ${r.amount} UCT` : ""}
                  </p>
                </div>
                <time className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(r.timestamp), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="depth-panel rounded-2xl p-4 text-xs leading-relaxed text-muted-foreground sm:p-5">
        <p className="font-medium text-foreground/90">About this integration</p>
        <p className="mt-2">
          SphereFlow models Unicity Astrid OS agent safety: tools require
          granted capabilities, high-risk sends are amount-gated, and every gate
          writes a session receipt. Full capsule runtime can later host these
          tools under a native Astrid kernel; this layer is the product-facing
          bridge today.
        </p>
      </div>
    </div>
  );
}