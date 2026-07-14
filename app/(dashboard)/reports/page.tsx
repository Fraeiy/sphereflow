"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/treasury/AnalyticsCard";
import { TreasuryChart } from "@/components/treasury/TreasuryChart";
import { BudgetChart } from "@/components/treasury/BudgetChart";
import { TransactionTable } from "@/components/treasury/TransactionTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTreasury } from "@/hooks/use-treasury";
import { generateSpendingReport } from "@/services/reports";
import { formatUCT } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

export default function ReportsPage() {
  const { payments, snapshot, policy } = useTreasury();
  const [period, setPeriod] = useState<Period>("monthly");

  const report = generateSpendingReport(payments, period);

  const budgetUtilization = policy
    ? Math.round((report.total / policy.monthlyBudget) * 100)
    : 0;

  const handleExport = () => {
    const content = [
      `SphereFlow Treasury Report — ${period}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `Total Spending: ${report.total} UCT`,
      `Transactions: ${report.transactions.length}`,
      ``,
      `Category Breakdown:`,
      ...report.byCategory.map(
        (c) => `  ${c.category}: ${c.amount} UCT (${c.percentage}%)`
      ),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sphereflow-report-${period}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Treasury analytics and spending breakdown"
      >
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      <div className="flex gap-2">
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn("filter-pill", period === p && "filter-pill-active")}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Spending"
          metric={formatUCT(report.total)}
          period={`last ${period}`}
        />
        <AnalyticsCard
          title="Transactions"
          metric={String(report.transactions.length)}
          period={period}
        />
        <AnalyticsCard
          title="Budget Utilization"
          metric={`${budgetUtilization}%`}
          change={budgetUtilization > 80 ? -5 : 3}
          period="monthly budget"
          description={
            policy
              ? `${formatUCT(report.total)} of ${formatUCT(policy.monthlyBudget)}`
              : undefined
          }
        />
        <AnalyticsCard
          title="Treasury Health"
          metric={`${snapshot?.healthScore ?? 0}/100`}
          period="current"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TreasuryChart title={`${period} Spending Trend`} data={report.trend} />
        <BudgetChart
          title="Category Breakdown"
          data={
            report.byCategory.length > 0
              ? report.byCategory
              : [{ category: "No data", amount: 0, percentage: 0 }]
          }
        />
      </div>

      <div>
        <p className="section-label mb-4">
          {period.charAt(0).toUpperCase() + period.slice(1)} Transactions
        </p>
        <TransactionTable transactions={report.transactions} />
      </div>
    </div>
  );
}