"use client";

import { DepthCard } from "@/components/ui/depth-card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn, formatUCT } from "@/lib/utils";
import type { PolicyRuleType } from "@/types/treasury";

interface PolicyCardProps {
  type: PolicyRuleType;
  title: string;
  description: string;
  value: string | number | boolean | string[];
  editable?: boolean;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  onEdit?: () => void;
  className?: string;
}

export function PolicyCard({
  title,
  description,
  value,
  editable = true,
  enabled = true,
  onToggle,
  onEdit,
  className,
}: PolicyCardProps) {
  const displayValue = () => {
    if (typeof value === "boolean") return value ? "Active" : "Inactive";
    if (Array.isArray(value))
      return value.length > 0 ? value.join(", ") : "None configured";
    if (typeof value === "number") return formatUCT(value);
    return value;
  };

  const isNumeric = typeof value === "number";

  return (
    <DepthCard
      tilt
      className={cn(
        "h-full",
        editable && "cursor-pointer",
        !enabled && "opacity-60",
        className
      )}
      innerClassName="h-full"
    >
      <div
        className="flex h-full flex-col p-5"
        onClick={editable ? onEdit : undefined}
        onKeyDown={
          editable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onEdit?.();
              }
            : undefined
        }
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          {onToggle && (
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <Badge
            variant={enabled ? "default" : "secondary"}
            className={cn(isNumeric && "font-mono tabular-nums")}
          >
            {displayValue()}
          </Badge>
          {editable && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Edit
            </span>
          )}
        </div>
      </div>
    </DepthCard>
  );
}