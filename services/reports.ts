import type { Payment, SpendingReport } from "@/types/treasury";
import { format } from "date-fns";

export function generateSpendingReport(
  payments: Payment[],
  period: "daily" | "weekly" | "monthly"
): SpendingReport {
  const days = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const completed = payments.filter(
    (p) =>
      p.status === "completed" &&
      new Date(p.executedAt ?? p.createdAt).getTime() > cutoff
  );

  const total = completed.reduce((sum, p) => sum + p.amount, 0);

  const categoryMap = new Map<string, number>();
  for (const p of completed) {
    categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + p.amount);
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const trendDays = period === "daily" ? 7 : period === "weekly" ? 7 : 30;
  const trend: { date: string; amount: number }[] = [];

  for (let i = trendDays - 1; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayTotal = completed
      .filter((p) => {
        const d = new Date(p.executedAt ?? p.createdAt);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    trend.push({
      date: format(dayStart, period === "monthly" ? "MMM d" : "EEE"),
      amount: dayTotal,
    });
  }

  return {
    period,
    total,
    byCategory,
    transactions: completed,
    trend,
  };
}