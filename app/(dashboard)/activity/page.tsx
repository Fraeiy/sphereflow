"use client";

import { ActivityCard } from "@/components/treasury/ActivityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTreasury } from "@/hooks/use-treasury";
import { Bot } from "lucide-react";

export default function ActivityPage() {
  const { activities, isLoading } = useTreasury();

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Activity</h1>
          <p className="text-sm text-muted-foreground">
            Complete timeline of autonomous treasury decisions
          </p>
        </div>
        <Badge variant="default" className="gap-1">
          <Bot className="h-3 w-3" />
          {activities.length} events
        </Badge>
      </div>

      <div className="relative space-y-4">
        <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-border" />
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-12">
            <div className="absolute left-4 top-5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <ActivityCard activity={activity} />
          </div>
        ))}
        {activities.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No agent activity yet. Start by setting a mandate in AI Treasury Chat.
          </p>
        )}
      </div>
    </div>
  );
}