"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/30",
        !enabled && "opacity-60",
        className
      )}
      onClick={editable ? onEdit : undefined}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {onToggle && (
          <Switch checked={enabled} onCheckedChange={onToggle} />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={enabled ? "default" : "secondary"}>
            {displayValue()}
          </Badge>
          {editable && (
            <span className="text-xs text-muted-foreground">Click to edit</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}