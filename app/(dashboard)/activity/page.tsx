"use client";

import { ActivityCard } from "@/components/treasury/ActivityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTreasury } from "@/hooks/use-treasury";
import { Bot, Activity } from "lucide-react";

export default function ActivityPage() {
  const { activities, isLoading } = useTreasury();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity"
        description="Complete timeline of autonomous treasury decisions"
      >
        <Badge variant="secondary" className="gap-1.5 font-mono text-xs">
          <Bot className="h-3 w-3" />
          {activities.length} events
        </Badge>
      </PageHeader>

      <div className="relative space-y-4">
        {activities.length > 0 && (
          <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-white/[0.06]" />
        )}
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-12">
            <div className="absolute left-4 top-5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background shadow-[0_0_8px_rgba(232,163,23,0.4)]" />
            <ActivityCard activity={activity} />
          </div>
        ))}
        {activities.length === 0 && (
          <div className="depth-panel flex flex-col items-center justify-center rounded-2xl py-16 text-center">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No agent activity</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Issue a mandate in Treasury Chat to begin autonomous policy
              execution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}