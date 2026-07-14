"use client";

import {
  Wallet,
  Shield,
  TrendingDown,
  Clock,
  Activity,
  Heart,
} from "lucide-react";
import { TreasuryCard } from "@/components/treasury/TreasuryCard";
import { ReserveWidget } from "@/components/treasury/ReserveWidget";
import { TreasuryChart } from "@/components/treasury/TreasuryChart";
import { ActivityCard } from "@/components/treasury/ActivityCard";
import { TransactionTable } from "@/components/treasury/TransactionTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTreasury } from "@/hooks/use-treasury";
import { generateSpendingReport } from "@/services/reports";

export default function DashboardPage() {
  const { snapshot, policy, payments, activities, isLoading, isLive, connection } =
    useTreasury();

  if (isLoading || !snapshot || !policy) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const weeklyReport = generateSpendingReport(payments, "weekly");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          isLive && connection
            ? "Live testnet treasury — balances synced from Sphere Connect"
            : "Treasury overview, policy health, and agent activity"
        }
      >
        <Badge
          variant={
            snapshot.healthScore >= 80
              ? "success"
              : snapshot.healthScore >= 50
                ? "warning"
                : "destructive"
          }
        >
          Health {snapshot.healthScore}
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TreasuryCard
          title="Treasury Balance"
          value={snapshot.balance}
          icon={Wallet}
          delay={0}
        />
        <TreasuryCard
          title="Reserved Funds"
          value={snapshot.reserved}
          icon={Shield}
          subtitle={`${policy.reserveBalance > 0 ? "Policy enforced" : "No reserve set"}`}
          delay={0.05}
        />
        <TreasuryCard
          title="Available Funds"
          value={snapshot.available}
          icon={Wallet}
          delay={0.1}
        />
        <TreasuryCard
          title="Monthly Spending"
          value={snapshot.monthlySpent}
          icon={TrendingDown}
          subtitle={`Budget: ${policy.monthlyBudget} UCT`}
          delay={0.15}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TreasuryCard
          title="Daily Budget Used"
          value={snapshot.dailySpent}
          suffix={`/ ${policy.dailySpendLimit}`}
          icon={Clock}
          delay={0.2}
        />
        <TreasuryCard
          title="Pending Payments"
          value={snapshot.pendingPayments}
          suffix="payments"
          formatAsUct={false}
          icon={Activity}
          delay={0.25}
        />
        <TreasuryCard
          title="Treasury Health"
          value={snapshot.healthScore}
          suffix="/ 100"
          formatAsUct={false}
          icon={Heart}
          delay={0.3}
        />
        <ReserveWidget
          reserved={snapshot.reserved}
          available={snapshot.available}
          balance={snapshot.balance}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TreasuryChart
          title="Weekly Spending Trend"
          data={weeklyReport.trend}
        />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Agent Actions</h2>
          {activities.slice(0, 4).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <TransactionTable transactions={payments.slice(0, 5)} />
      </div>
    </div>
  );
}