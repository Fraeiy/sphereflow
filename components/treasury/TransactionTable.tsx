"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatUCT, truncateAddress } from "@/lib/utils";
import type { Payment, PaymentStatus } from "@/types/treasury";

const statusVariant: Record<
  PaymentStatus,
  "default" | "success" | "warning" | "destructive" | "secondary"
> = {
  pending: "warning",
  approved: "default",
  rejected: "destructive",
  executing: "default",
  completed: "success",
  failed: "destructive",
  scheduled: "secondary",
  frozen: "destructive",
};

interface TransactionTableProps {
  transactions: Payment[];
  onSelect?: (payment: Payment) => void;
  emptyMessage?: string;
}

export function TransactionTable({
  transactions,
  onSelect,
  emptyMessage = "No transactions yet",
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="depth-panel flex flex-col items-center justify-center rounded-2xl py-16 text-center">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground/80">
          No transactions
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="space-y-2 sm:hidden">
        {transactions.map((tx) => (
          <button
            key={tx.id}
            type="button"
            className={cn(
              "depth-panel w-full rounded-xl p-3.5 text-left",
              onSelect && "active:scale-[0.99]"
            )}
            onClick={() => onSelect?.(tx)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-sm font-medium">
                {truncateAddress(tx.recipient, 8)}
              </p>
              <Badge variant={statusVariant[tx.status]} className="shrink-0">
                {tx.status}
              </Badge>
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="font-mono text-base font-medium tabular-nums">
                {formatUCT(tx.amount)}
              </p>
              <p className="font-mono text-[10px] capitalize text-muted-foreground">
                {tx.type} ·{" "}
                {formatDistanceToNow(new Date(tx.executedAt ?? tx.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {tx.memo && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {tx.memo}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="data-table hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className={cn(onSelect && "cursor-pointer")}
                onClick={() => onSelect?.(tx)}
              >
                <td>
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {truncateAddress(tx.recipient, 8)}
                    </p>
                    {tx.memo && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {tx.memo}
                      </p>
                    )}
                  </div>
                </td>
                <td className="font-mono font-medium tabular-nums">
                  {formatUCT(tx.amount)}
                </td>
                <td className="capitalize text-muted-foreground">{tx.type}</td>
                <td>
                  <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                </td>
                <td className="font-mono text-xs text-muted-foreground">
                  {formatDistanceToNow(
                    new Date(tx.executedAt ?? tx.createdAt),
                    { addSuffix: true }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}