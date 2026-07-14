"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_CATEGORIES } from "@/lib/constants";
import type { PaymentType } from "@/types/treasury";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: {
    recipient: string;
    amount: number;
    type: PaymentType;
    category: string;
    memo?: string;
    scheduledAt?: string;
  }) => void;
}

export function PaymentDialog({ open, onClose, onSubmit }: PaymentDialogProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<PaymentType>("instant");
  const [category, setCategory] = useState<string>(PAYMENT_CATEGORIES[0]);
  const [memo, setMemo] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!recipient || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSubmit({
      recipient,
      amount: parsedAmount,
      type,
      category,
      memo: memo || undefined,
      scheduledAt: type === "scheduled" ? scheduledAt : undefined,
    });

    setRecipient("");
    setAmount("");
    setMemo("");
    setScheduledAt("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-semibold">Create Payment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments are validated by the policy engine before Sphere settlement.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Recipient
            </label>
            <Input
              placeholder="@alice or wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Amount (UCT)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PaymentType)}
                className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="instant">Instant</option>
                <option value="scheduled">Scheduled</option>
                <option value="recurring">Recurring</option>
                <option value="invoice">Invoice</option>
                <option value="escrow">Escrow</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              >
                {PAYMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type === "scheduled" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Schedule Date
              </label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Memo
            </label>
            <Input
              placeholder="Payment description"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Payment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}