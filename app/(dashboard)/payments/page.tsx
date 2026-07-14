"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/treasury/TransactionTable";
import { PaymentDialog } from "@/components/treasury/PaymentDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTreasury } from "@/hooks/use-treasury";
import {
  savePayment,
  saveActivities,
  updatePayment,
} from "@/services/treasury-store";
import { validatePayment, shouldAutoApprove } from "@/lib/policy-engine";
import { executeSphereTransfer } from "@/sphere/client";
import { formatUCT } from "@/lib/amounts";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Payment, PaymentStatus, PaymentType } from "@/types/treasury";

type Filter = "all" | PaymentStatus;

export default function PaymentsPage() {
  const {
    payments,
    policy,
    snapshot,
    connection,
    userId,
    refresh,
    setPayments,
    setActivities,
  } = useTreasury();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const handleCreatePayment = async (data: {
    recipient: string;
    amount: number;
    type: PaymentType;
    category: string;
    memo?: string;
    scheduledAt?: string;
  }) => {
    if (!policy || !snapshot) return;

    const validation = validatePayment(data, policy, snapshot);
    if (!validation.valid) {
      toast.error(validation.reason);
      return;
    }

    const autoApprove = shouldAutoApprove(data.amount, policy);
    const now = new Date().toISOString();

    const payment: Payment = {
      id: generateId(),
      userId,
      type: data.type,
      recipient: data.recipient,
      amount: data.amount,
      status:
        data.type === "scheduled"
          ? "scheduled"
          : autoApprove
            ? "approved"
            : "pending",
      category: data.category,
      memo: data.memo,
      scheduledAt: data.scheduledAt,
      createdAt: now,
    };

    savePayment(payment);
    setPayments((prev) => [payment, ...prev]);

    if (autoApprove && data.type === "instant" && connection) {
      const transfer = await executeSphereTransfer(connection.client, {
        recipient: data.recipient,
        amount: data.amount,
        memo: data.memo,
      });

      if (transfer.success) {
        const updated = updatePayment(userId, payment.id, {
          status: "completed",
          executedAt: new Date().toISOString(),
          transferId: transfer.transferId,
          deliveryPending: transfer.deliveryPending,
        });
        if (updated)
          setPayments((prev) =>
            prev.map((p) => (p.id === payment.id ? updated : p))
          );
        toast.success("Payment settled via Sphere SDK");
      } else {
        toast.error(transfer.error ?? "Settlement failed");
      }
    } else if (autoApprove) {
      toast.success("Payment approved — connect wallet for Sphere settlement");
    } else {
      toast.info("Payment pending manual approval");
    }

    await refresh();
  };

  const handleApprove = async (payment: Payment) => {
    if (!connection) {
      toast.error("Connect Sphere wallet to settle payments");
      return;
    }

    const transfer = await executeSphereTransfer(connection.client, {
      recipient: payment.recipient,
      amount: payment.amount,
      memo: payment.memo,
    });

    if (transfer.success) {
      const updated = updatePayment(userId, payment.id, {
        status: "completed",
        executedAt: new Date().toISOString(),
        transferId: transfer.transferId,
        deliveryPending: transfer.deliveryPending,
      });
      if (updated) {
        setPayments((prev) =>
          prev.map((p) => (p.id === payment.id ? updated : p))
        );
      }
      saveActivities(userId, [
        {
          id: generateId(),
          userId,
          type: "payment_executed",
          title: `Executed payment to ${payment.recipient}`,
          description: `${payment.amount} UCT settled via Sphere SDK`,
          timestamp: new Date().toISOString(),
        },
      ]);
      toast.success("Payment approved and settled");
      await refresh();
    } else {
      toast.error(transfer.error ?? "Settlement failed");
    }
  };

  const handleReject = (payment: Payment) => {
    const updated = updatePayment(userId, payment.id, { status: "rejected" });
    if (updated) {
      setPayments((prev) =>
        prev.map((p) => (p.id === payment.id ? updated : p))
      );
    }
    toast.info("Payment rejected");
  };

  const pending = payments.filter((p) => p.status === "pending");
  const filtered =
    filter === "all"
      ? payments
      : payments.filter((p) => p.status === filter);

  const filters: Filter[] = ["all", "completed", "scheduled", "pending"];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Create and manage treasury payments with policy validation"
      >
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Payment
        </Button>
      </PageHeader>

      {pending.length > 0 && (
        <div className="space-y-3">
          <p className="section-label">
            Pending Approval ({pending.length})
          </p>
          {pending.map((payment) => (
            <div
              key={payment.id}
              className="depth-panel flex items-center justify-between rounded-2xl p-4"
            >
              <div>
                <p className="font-mono text-sm font-medium tabular-nums">
                  {formatUCT(payment.amount)}
                  <span className="mx-2 text-muted-foreground">→</span>
                  {payment.recipient}
                </p>
                {payment.memo && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {payment.memo}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-emerald-500/30 text-emerald-400"
                  onClick={() => handleApprove(payment)}
                >
                  <Check className="h-3 w-3" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-red-500/30 text-red-400"
                  onClick={() => handleReject(payment)}
                >
                  <X className="h-3 w-3" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "filter-pill",
              filter === f && "filter-pill-active"
            )}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                {payments.filter((p) => p.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <TransactionTable
        transactions={filtered}
        emptyMessage="No payments yet. Create your first treasury payment."
      />

      <PaymentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreatePayment}
      />
    </div>
  );
}