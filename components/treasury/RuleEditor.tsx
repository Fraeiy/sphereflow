"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { TreasuryPolicy } from "@/types/treasury";

interface RuleEditorProps {
  open: boolean;
  policy: TreasuryPolicy;
  field: keyof TreasuryPolicy | null;
  onClose: () => void;
  onSave: (updates: Partial<TreasuryPolicy>) => void;
}

const fieldLabels: Record<string, { label: string; type: "number" | "wallets" | "boolean" }> = {
  reserveBalance: { label: "Reserve Balance (UCT)", type: "number" },
  dailySpendLimit: { label: "Daily Spend Limit (UCT)", type: "number" },
  weeklySpendLimit: { label: "Weekly Spend Limit (UCT)", type: "number" },
  monthlyBudget: { label: "Monthly Budget (UCT)", type: "number" },
  maxSingleTransaction: { label: "Max Single Transaction (UCT)", type: "number" },
  autoApproveThreshold: { label: "Auto-Approve Threshold (UCT)", type: "number" },
  allowedWallets: { label: "Allowed Wallets", type: "wallets" },
  blockedWallets: { label: "Blocked Wallets", type: "wallets" },
  emergencyFreeze: { label: "Emergency Freeze", type: "boolean" },
};

export function RuleEditor({
  open,
  policy,
  field,
  onClose,
  onSave,
}: RuleEditorProps) {
  const [value, setValue] = useState<string>("");
  const [boolValue, setBoolValue] = useState(false);

  useEffect(() => {
    if (!field) return;
    const current = policy[field];
    if (typeof current === "boolean") {
      setBoolValue(current);
    } else if (Array.isArray(current)) {
      setValue(current.join(", "));
    } else {
      setValue(String(current ?? ""));
    }
  }, [field, policy]);

  if (!open || !field) return null;

  const config = fieldLabels[field];
  if (!config) return null;

  const handleSave = () => {
    let update: Partial<TreasuryPolicy> = {};

    if (config.type === "number") {
      update = { [field]: parseFloat(value) || 0 };
    } else if (config.type === "wallets") {
      update = {
        [field]: value
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean),
      };
    } else if (config.type === "boolean") {
      update = { [field]: boolValue };
    }

    onSave(update);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-semibold">Edit Policy Rule</h2>
        <p className="mt-1 text-sm text-muted-foreground">{config.label}</p>

        <div className="mt-6">
          {config.type === "boolean" ? (
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable emergency freeze</span>
              <Switch checked={boolValue} onCheckedChange={setBoolValue} />
            </div>
          ) : config.type === "wallets" ? (
            <Input
              placeholder="@alice, @bob (comma-separated)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <Input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Rule</Button>
        </div>
      </div>
    </div>
  );
}