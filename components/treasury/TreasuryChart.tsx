"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DepthCard } from "@/components/ui/depth-card";

interface TreasuryChartProps {
  title: string;
  data: { date: string; amount: number }[];
  color?: string;
}

export function TreasuryChart({
  title,
  data,
  color = "#E8A317",
}: TreasuryChartProps) {
  return (
    <DepthCard tilt={false} innerClassName="h-full">
      <div className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
        <div className="mt-4 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="treasuryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#8b8b95"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#8b8b95"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: "#f4f4f5",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value ?? 0} UCT`, "Spent"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={color}
                fill="url(#treasuryGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DepthCard>
  );
}