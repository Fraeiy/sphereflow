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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TreasuryChartProps {
  title: string;
  data: { date: string; amount: number }[];
  color?: string;
}

export function TreasuryChart({
  title,
  data,
  color = "#F59E0B",
}: TreasuryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="treasuryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis
                dataKey="date"
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#71717A"
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "8px",
                  color: "#FAFAFA",
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
      </CardContent>
    </Card>
  );
}