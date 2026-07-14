"use client";

import { formatDistanceToNow } from "date-fns";
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/5">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Recipient
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className={cn(
                "border-b border-border/50 transition-colors last:border-0",
                onSelect && "cursor-pointer hover:bg-muted/5"
              )}
              onClick={() => onSelect?.(tx)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{truncateAddress(tx.recipient, 8)}</p>
                  {tx.memo && (
                    <p className="text-xs text-muted-foreground">{tx.memo}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{formatUCT(tx.amount)}</td>
              <td className="px-4 py-3 capitalize text-muted-foreground">
                {tx.type}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
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
  );
}