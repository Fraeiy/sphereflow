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

const selectClass =
  "mt-1 flex h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25";

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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="depth-panel-elevated w-full max-w-md rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="section-label">Treasury</p>
        <h2 className="mt-1 font-display text-lg font-semibold">Create Payment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Validated by policy engine before Sphere settlement.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Recipient
            </label>
            <Input
              placeholder="@alice or wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Amount (UCT)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 font-mono tabular-nums"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PaymentType)}
                className={selectClass}
              >
                <option value="instant">Instant</option>
                <option value="scheduled">Scheduled</option>
                <option value="recurring">Recurring</option>
                <option value="invoice">Invoice</option>
                <option value="escrow">Escrow</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
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
              <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Schedule Date
              </label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-1 font-mono text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
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