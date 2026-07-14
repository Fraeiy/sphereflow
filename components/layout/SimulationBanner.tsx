"use client";

import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SimulationBanner() {
  return (
    <div className="flex items-center gap-3 border-b border-amber-500/20 bg-amber-500/5 px-6 py-2">
      <FlaskConical className="h-4 w-4 text-amber-400" />
      <p className="text-xs text-amber-200/80">
        <span className="font-medium">Simulation Mode</span> — Yield and lending
        features are simulated for demonstration. No real funds are invested.
      </p>
      <Badge variant="warning" className="ml-auto shrink-0">
        Demo
      </Badge>
    </div>
  );
}